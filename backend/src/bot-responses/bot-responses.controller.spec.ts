import { Test, TestingModule } from '@nestjs/testing';
import { BotResponsesController } from './bot-responses.controller.js';
import { BotResponsesService } from './bot-responses.service.js';

describe('BotResponsesController', () => {
  let controller: BotResponsesController;

  const mockBotResponsesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotResponsesController],
      providers: [
        {
          provide: BotResponsesService,
          useValue: mockBotResponsesService,
        },
      ],
    }).compile();

    controller = module.get<BotResponsesController>(BotResponsesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create and return the result', async () => {
    const dto = { keyword: 'ayuda', response: 'Texto de ayuda' };
    const expected = { id: 1, ...dto, isActive: true };

    mockBotResponsesService.create.mockResolvedValue(expected);

    const result = await controller.create(dto);

    expect(result).toEqual(expected);
    expect(mockBotResponsesService.create).toHaveBeenCalledWith(dto);
  });

  it('should call service.findAll and return an array', async () => {
    const expected = [{ id: 1, keyword: 'hola', response: 'Hola' }];
    mockBotResponsesService.findAll.mockResolvedValue(expected);

    const result = await controller.findAll();

    expect(result).toEqual(expected);
    expect(mockBotResponsesService.findAll).toHaveBeenCalled();
  });

  it('should call service.findOne with parsed id', async () => {
    const expected = { id: 1, keyword: 'hola', response: 'Hola' };
    mockBotResponsesService.findOne.mockResolvedValue(expected);

    // Verificamos que pasa el string '1' y el controlador lo convierte al número 1 (+id)
    const result = await controller.findOne('1');

    expect(result).toEqual(expected);
    expect(mockBotResponsesService.findOne).toHaveBeenCalledWith(1);
  });

  it('should call service.update with parsed id and dto', async () => {
    const dto = { response: 'Texto actualizado' };
    const expected = { id: 1, keyword: 'hola', ...dto };
    mockBotResponsesService.update.mockResolvedValue(expected);

    const result = await controller.update('1', dto);

    expect(result).toEqual(expected);
    expect(mockBotResponsesService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call service.remove with parsed id', async () => {
    const expected = { id: 1, keyword: 'hola', response: 'Hola' };
    mockBotResponsesService.remove.mockResolvedValue(expected);

    const result = await controller.remove('1');

    expect(result).toEqual(expected);
    expect(mockBotResponsesService.remove).toHaveBeenCalledWith(1);
  });
});
