import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BotResponsesService } from './bot-responses.service';
import { CreateBotResponseDto } from './dto/create-bot-response.dto';
import { UpdateBotResponseDto } from './dto/update-bot-response.dto';

@Controller('bot-responses')
export class BotResponsesController {
  constructor(private readonly botResponsesService: BotResponsesService) {}

  @Post()
  create(@Body() createBotResponseDto: CreateBotResponseDto) {
    return this.botResponsesService.create(createBotResponseDto);
  }

  @Get()
  findAll() {
    return this.botResponsesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botResponsesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBotResponseDto: UpdateBotResponseDto,
  ) {
    return this.botResponsesService.update(+id, updateBotResponseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.botResponsesService.remove(+id);
  }
}
