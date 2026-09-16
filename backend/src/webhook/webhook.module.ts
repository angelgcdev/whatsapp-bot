import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';
import { BotModule } from 'src/bot/bot.module';

@Module({
  imports: [WhatsappModule, BotModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
