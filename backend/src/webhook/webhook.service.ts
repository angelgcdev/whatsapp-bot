import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
  constructor(private readonly configService: ConfigService) {}

  verifyWebhook(mode: string, token: string, challenge: string): string {
    const verifyToken = this.configService.get<string>('WHATSAPP_VERIFY_TOKEN');

    if (mode === 'subscribe' && token === verifyToken) {
      return challenge;
    }

    throw new ForbiddenException('Invalid verify token or mode');
  }
}
