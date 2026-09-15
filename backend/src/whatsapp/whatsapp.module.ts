import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Module({
  controllers: [],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
