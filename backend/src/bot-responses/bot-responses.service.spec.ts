import { Test, TestingModule } from '@nestjs/testing';
import { BotResponsesService } from './bot-responses.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('BotResponsesService', () => {
  let service: BotResponsesService;

  const mockPrismaService = {
    botResponse: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotResponsesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BotResponsesService>(BotResponsesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of bot responses', async () => {
      const mockResposes = [
        {
          id: 1,
          keyword: 'hola',
          response: '¡Hola! Bienvenido.',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.botResponse.findMany.mockResolvedValue(mockResposes);

      const result = await service.findAll();

      expect(result).toEqual(mockResposes);
      expect(mockPrismaService.botResponse.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a bot response if found', async () => {
      const mockResponse = {
        id: 1,
        keyword: 'hola',
        response: '¡Hola!',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.botResponse.findUnique.mockResolvedValue(mockResponse);

      const result = await service.findOne(1);

      expect(result).toEqual(mockResponse);
      expect(mockPrismaService.botResponse.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if bot response is not found', async () => {
      mockPrismaService.botResponse.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new bot response with normalized keyword', async () => {
      const dto = {
        keyword: '  PROMO  ',
        response: 'Nuestros descuentos...',
        isActive: true,
      };

      const createdResponse = {
        id: 2,
        keyword: 'promo',
        response: dto.response,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 1. findUnique dice que no existe
      mockPrismaService.botResponse.findUnique.mockResolvedValue(null);

      // 2. create devuelve el registro creado
      mockPrismaService.botResponse.create.mockResolvedValue(createdResponse);

      const result = await service.create(dto);

      expect(result).toEqual(createdResponse);
      expect(mockPrismaService.botResponse.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          keyword: 'promo', // Verificamos que se normalizó
        },
      });
    });

    it('should throw ConflictException if keyword already exists', async () => {
      const dto = {
        keyword: 'hola',
        response: 'Ya existo',
      };

      // findUnique dice que ya existe un registro
      mockPrismaService.botResponse.findUnique.mockResolvedValue({
        id: 1,
        keyword: 'hola',
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      // Verificamos que jamás intentó crear en la base de datos
      expect(mockPrismaService.botResponse.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a bot response successfully', async () => {
      const existing = {
        id: 1,
        keyword: 'hola',
        response: 'Antigua respuesta',
        isActive: true,
      };

      const updated = {
        ...existing,
        response: 'Nueva respuesta actualizada',
      };

      // 1. findOne encuentra el registro original
      mockPrismaService.botResponse.findUnique.mockResolvedValueOnce(existing);
      // 2. update devuelve el registro modificado
      mockPrismaService.botResponse.update.mockResolvedValue(updated);

      const result = await service.update(1, {
        response: 'Nueva respuesta actualizada',
      });

      expect(result).toEqual(updated);
      expect(mockPrismaService.botResponse.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { response: 'Nueva respuesta actualizada' },
      });
    });

    it('should throw ConflictException if updated keyword is already taken by another record', async () => {
      const current = { id: 1, keyword: 'hola', response: 'Hola' };
      const another = { id: 2, keyword: 'menu', response: 'Menu' };

      // 1. findOne encuentra el registro actual con id 1
      mockPrismaService.botResponse.findUnique.mockResolvedValueOnce(current);

      // 2. findUnique por keyword encuentra OTRO registro con id 2
      mockPrismaService.botResponse.findUnique.mockResolvedValueOnce(another);

      await expect(service.update(1, { keyword: 'menu' })).rejects.toThrow(
        ConflictException,
      );

      expect(mockPrismaService.botResponse.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a bot response if found', async () => {
      const existing = { id: 1, keyword: 'hola', response: 'Hola' };

      mockPrismaService.botResponse.findUnique.mockResolvedValue(existing);
      mockPrismaService.botResponse.delete.mockResolvedValue(existing);

      const result = await service.remove(1);

      expect(result).toEqual(existing);
      expect(mockPrismaService.botResponse.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
