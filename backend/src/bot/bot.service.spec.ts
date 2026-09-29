import { Test, TestingModule } from '@nestjs/testing';
import { BotService } from './bot.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('BotService', () => {
  let service: BotService;
  let prismaService: {
    botResponse: {
      findFirst: jest.Mock;
    };
  };

  beforeEach(async () => {
    // Arrange: Configurar el mock de PrismaService y el módulo de pruebas
    prismaService = {
      botResponse: {
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<BotService>(BotService);
  });

  it('should be defined', () => {
    // Assert
    expect(service).toBeDefined();
  });

  describe('processMessage', () => {
    it('should return active bot response when keyword matches', async () => {
      // Arrange
      const inputMessage = '  HOLA  ';
      const mockResponse = {
        id: 1,
        keyword: 'hola',
        response: '👋 ¡Hola! Bienvenido.',
        isActive: true,
      };
      prismaService.botResponse.findFirst.mockResolvedValue(mockResponse);

      // Act
      const result = await service.processMessage(inputMessage);

      // Assert
      expect(prismaService.botResponse.findFirst).toHaveBeenCalledWith({
        where: {
          keyword: 'hola',
          isActive: true,
        },
      });
      expect(result).toBe('👋 ¡Hola! Bienvenido.');
    });

    it('should return dynamic fallback from database when keyword does not match', async () => {
      // Arrange
      const inputMessage = 'unknown_command';
      const mockFallbackResponse = {
        id: 99,
        keyword: 'fallback',
        response: '🤖 Comando no reconocido (Fallback DB).',
        isActive: true,
      };
      prismaService.botResponse.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockFallbackResponse);

      // Act
      const result = await service.processMessage(inputMessage);

      // Assert
      expect(prismaService.botResponse.findFirst).toHaveBeenNthCalledWith(1, {
        where: {
          keyword: 'unknown_command',
          isActive: true,
        },
      });
      expect(prismaService.botResponse.findFirst).toHaveBeenNthCalledWith(2, {
        where: {
          keyword: 'fallback',
          isActive: true,
        },
      });
      expect(result).toBe('🤖 Comando no reconocido (Fallback DB).');
    });

    it('should return default safety fallback when database fallback is not found', async () => {
      // Arrange
      const inputMessage = 'unknown_command';
      prismaService.botResponse.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      // Act
      const result = await service.processMessage(inputMessage);

      // Assert
      expect(result).toContain('🤖 No entendí ese comando.');
    });
  });
});
