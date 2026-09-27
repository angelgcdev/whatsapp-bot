import { Module } from '@nestjs/common';
import { BotResponsesService } from './bot-responses.service';
import { BotResponsesController } from './bot-responses.controller';

@Module({
  controllers: [BotResponsesController],
  providers: [BotResponsesService],
})
export class BotResponsesModule {}
