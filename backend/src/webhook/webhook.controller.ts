import { Controller, Get, Query, Logger } from '@nestjs/common';
import { WebhookService } from './webhook.service';

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
}
