import {
  Controller,
  Get,
  Query,
  Logger,
  Post,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import type { WhatsAppPayload } from './interfaces/whatsapp-payload.interface';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly webhookService: WebhookService) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ): string {
    this.logger.log(
      `🔍 Handshake attempt received: mode=${mode}, token=${token}, challenge=${challenge}`,
    );

    const result = this.webhookService.verifyWebhook(mode, token, challenge);

    this.logger.log(
      '✅ Handshake verification successful! Returning challenge.',
    );
    return result;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleIncoming(@Body() payload: WhatsAppPayload): Promise<string> {
    this.logger.log('📩 Incoming webhook event received');
    return this.webhookService.handleIncoming(payload);
  }
}
