import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageSender } from '../generated/prisma/enums';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateByPhone(phoneNumber: string, contactName?: string) {
    let conversation = await this.prisma.conversation.findUnique({
      where: { phoneNumber },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          phoneNumber,
          contactName: contactName ?? null,
        },
      });
    } else if (contactName && conversation.contactName !== contactName) {
      conversation = await this.prisma.conversation.update({
        where: { id: conversation.id },
        data: { contactName },
      });
    }

    return conversation;
  }

  async createMessage(
    conversationId: string,
    sender: MessageSender,
    text: string,
  ) {
    return this.prisma.message.create({
      data: {
        conversationId,
        sender,
        text,
      },
    });
  }

  async getRecentMessages(conversationId: string, limit = 10) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }
}
