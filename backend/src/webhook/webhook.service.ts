import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WhatsAppPayload } from './interfaces/whatsapp-payload.interface';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { BotService } from 'src/bot/bot.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly whatsappService: WhatsappService,
    private readonly botService: BotService,
  ) {}

  verifyWebhook(mode: string, token: string, challenge: string): string {
    const verifyToken = this.configService.get<string>('WHATSAPP_VERIFY_TOKEN');

    if (mode === 'subscribe' && token === verifyToken) {
      return challenge;
    }

    throw new ForbiddenException('Invalid verify token or mode');
  }

  async handleIncoming(payload: WhatsAppPayload): Promise<string> {
    const entry = payload.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    // Verificamos si realmente llegó un mensaje de texto
    if (message && message.type === 'text' && message.text?.body) {
      const from = message.from;
      const text = message.text.body;

      this.logger.log(`💬 Text message received from ${from}: "${text}"`);

      // 🤖 Respondemos con el Eco al usuario
      try {
        const replyText = this.botService.processMessage(text);
        await this.whatsappService.sendTextMessage(from, replyText);
      } catch (error) {
        this.logger.error(
          `Failed to send echo message to ${from}`,
          error instanceof Error ? error.stack : String(error),
        );
      }
    } else if (value?.statuses?.[0]) {
      // Meta también notifica estados de entrega: "sent", "delivered", "read"
      this.logger.debug(
        `ℹ️ Status update received: ${value.statuses[0].status}`,
      );
    } else {
      this.logger.warn(
        '⚠️ Webhook event received without recognizable message or status',
      );
    }

    // Meta siempre requiere que respondamos con éxito para no reintentar
    return 'EVENT_RECEIVED';
  }
}
