import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { WebhookModule } from './webhook/webhook.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { BotModule } from './bot/bot.module';
import { PrismaModule } from './prisma/prisma.module';
import { BotResponsesModule } from './bot-responses/bot-responses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WebhookModule,
    WhatsappModule,
    BotModule,
    PrismaModule,
    BotResponsesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
