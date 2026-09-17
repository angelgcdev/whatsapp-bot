import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [WhatsappModule, BotModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
