import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WhatsAppSendMessageResponse } from './interfaces/whatsapp-send-response.interface';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendTextMessage(
    to: string,
    bodyText: string,
  ): Promise<WhatsAppSendMessageResponse> {
    const token = this.configService.get<string>('WHATSAPP_TOKEN');
    const phoneNumberId = this.configService.get<string>(
      'WHATSAPP_PHONE_NUMBER_ID',
    );

    const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: {
        preview_url: false,
        body: bodyText,
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as Record<string, unknown>;
        this.logger.error(
          `❌ Error sending message to ${to}: ${JSON.stringify(errorData)}`,
        );
        throw new Error(
          `WhatsApp API responded with status ${response.status}`,
        );
      }

      const data = (await response.json()) as WhatsAppSendMessageResponse;
      this.logger.log(`✅ Message sent successfully to ${to}`);
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `❌ Unexpected error in sendTextMessage: ${errorMessage}`,
      );
      throw error;
    }
  }
}
