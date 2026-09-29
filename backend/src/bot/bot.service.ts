import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BotService {
  constructor(private readonly prisma: PrismaService) {}

  async processMessage(text: string): Promise<string> {
    const command = text.trim().toLowerCase();

    // 1. Buscar comando activo en base de datos
    const botResponse = await this.prisma.botResponse.findFirst({
      where: {
        keyword: command,
        isActive: true,
      },
    });

    if (botResponse) {
      return botResponse.response;
    }

    // 2. Si no coincide, buscar mensaje de fallback configurado en BD
    const fallbackResponse = await this.prisma.botResponse.findFirst({
      where: {
        keyword: 'fallback',
        isActive: true,
      },
    });

    // 3. Retornar el fallback de BD o el se seguridad por defecto
    return fallbackResponse?.response ?? this.getFallbackMessage();
  }

  private getFallbackMessage(): string {
    return (
      '🤖 No entendí ese comando.\n\n' +
      'Por favor escribe *menu* o *ayuda* para ver las opciones disponibles.'
    );
  }
}
