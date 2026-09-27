import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBotResponseDto } from './dto/create-bot-response.dto.js';
import { UpdateBotResponseDto } from './dto/update-bot-response.dto.js';

@Injectable()
export class BotResponsesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBotResponseDto: CreateBotResponseDto) {
    const normalizedKeyword = createBotResponseDto.keyword.trim().toLowerCase();

    const existing = await this.prisma.botResponse.findUnique({
      where: { keyword: normalizedKeyword },
    });

    if (existing) {
      throw new ConflictException(
        `Bot response with keyword "${normalizedKeyword}" already exists`,
      );
    }

    return this.prisma.botResponse.create({
      data: {
        ...createBotResponseDto,
        keyword: normalizedKeyword,
      },
    });
  }

  async findAll() {
    return this.prisma.botResponse.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const botResponse = await this.prisma.botResponse.findUnique({
      where: { id },
    });

    if (!botResponse) {
      throw new NotFoundException(`Bot response with ID ${id} not found`);
    }

    return botResponse;
  }

  async update(id: number, updateBotResponseDto: UpdateBotResponseDto) {
    await this.findOne(id);

    const dataToUpdate = { ...updateBotResponseDto };
    if (dataToUpdate.keyword) {
      dataToUpdate.keyword = dataToUpdate.keyword.trim().toLowerCase();

      const existing = await this.prisma.botResponse.findUnique({
        where: { keyword: dataToUpdate.keyword },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Bot response with keyword "${dataToUpdate.keyword}" already exists`,
        );
      }
    }

    return this.prisma.botResponse.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.botResponse.delete({
      where: { id },
    });
  }
}
