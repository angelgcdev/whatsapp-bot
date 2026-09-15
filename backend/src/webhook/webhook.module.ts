import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';

@Module({
  imports: [WhatsappModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
