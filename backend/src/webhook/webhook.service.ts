import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  WhatsAppPayload,
  WhatsAppMessage,
  WhatsAppStatus,
} from './interfaces/whatsapp-payload.interface';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { BotService } from '../bot/bot.service';
import { ConversationsService } from '../conversations/conversations.service';
import { MessageSender } from '../generated/prisma/enums';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly whatsappService: WhatsappService,
    private readonly botService: BotService,
    private readonly conversationsService: ConversationsService,
  ) {}

  verifyWebhook(mode: string, token: string, challenge: string): string {
    const verifyToken = this.configService.get<string>('WHATSAPP_VERIFY_TOKEN');

    if (mode === 'subscribe' && token === verifyToken) {
      return challenge;
    }

    throw new ForbiddenException('Invalid verify token or mode');
  }

  // 🚦 Enrutador principal (Dispatcher)
  async handleIncoming(payload: WhatsAppPayload): Promise<string> {
    const value = payload.entry?.[0]?.changes?.[0]?.value;

    if (value?.messages?.[0]) {
      const contactName = value.contacts?.[0]?.profile?.name;
      await this.processIncomingMessage(value.messages[0], contactName);
    } else if (value?.statuses?.[0]) {
      this.processStatusUpdate(value.statuses[0]);
    } else {
      this.logger.warn(
        '⚠️ Webhook event received without recognizable message or status',
      );
    }

    return 'EVENT_RECEIVED';
  }

  // 💬 Procesa mensajes entrantes de clientes
  private async processIncomingMessage(
    message: WhatsAppMessage,
    contactName?: string,
  ): Promise<void> {
    if (message.type !== 'text' || !message.text?.body) {
      return;
    }

    const from = message.from;
    const text = message.text.body;

    this.logger.log(`💬 Text message received from ${from}: "${text}"`);

    // 1. Obtener o crear conversación en base de datos
    const conversation = await this.conversationsService.findOrCreateByPhone(
      from,
      contactName,
    );

    // 2. Guardar mensaje entrante del cliente
    await this.conversationsService.createMessage(
      conversation.id,
      MessageSender.CUSTOMER,
      text,
    );

    // 3. Si el bot está activo, generar respuesta y persistirla
    if (conversation.isBotActive) {
      try {
        const replyText = await this.botService.processMessage(text);
        await this.whatsappService.sendTextMessage(from, replyText);

        await this.conversationsService.createMessage(
          conversation.id,
          MessageSender.BOT,
          replyText,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send message to ${from}`,
          error instanceof Error ? error.stack : String(error),
        );
      }
    } else {
      this.logger.log(
        `⏸️ Bot is paused for conversation ${conversation.id} (${from}). Waiting for human agent.`,
      );
    }
  }

  // ℹ️ Procesa estados de lectura y entrega enviados por Meta
  private processStatusUpdate(status: WhatsAppStatus): void {
    this.logger.debug(`ℹ️ Status update received: ${status.status}`);
  }
}
