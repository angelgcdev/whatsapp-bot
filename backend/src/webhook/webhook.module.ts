import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { BotModule } from '../bot/bot.module';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  imports: [WhatsappModule, BotModule, ConversationsModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
