import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { WebhookService } from './webhook.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { BotService } from '../bot/bot.service';
import { ForbiddenException } from '@nestjs/common';
import { WhatsAppPayload } from './interfaces/whatsapp-payload.interface';

describe('WebhookService', () => {
  let service: WebhookService;
  let configService: { get: jest.Mock };
  let whatsappService: { sendTextMessage: jest.Mock };
  let botService: { processMessage: jest.Mock };

  beforeEach(async () => {
    configService = {
      get: jest.fn(),
    };

    whatsappService = {
      sendTextMessage: jest.fn(),
    };

    botService = {
      processMessage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        { provide: ConfigService, useValue: configService },
        { provide: WhatsappService, useValue: whatsappService },
        { provide: BotService, useValue: botService },
      ],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyWebhook', () => {
    const expectedToken = 'valid_secret_token';
    const challenge = '987654321';

    beforeEach(() => {
      configService.get.mockReturnValue(expectedToken);
    });

    it('should return challenge when mode is subscribe and token matches', () => {
      const result = service.verifyWebhook(
        'subscribe',
        expectedToken,
        challenge,
      );

      expect(configService.get).toHaveBeenCalledWith('WHATSAPP_VERIFY_TOKEN');
      expect(result).toBe(challenge);
    });

    it('should throw ForbiddenException when token does not match', () => {
      expect(() => {
        service.verifyWebhook('subscribe', 'wrong_token', challenge);
      }).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when mode is not subscribe', () => {
      expect(() => {
        service.verifyWebhook('invalid_mode', expectedToken, challenge);
      }).toThrow(ForbiddenException);
    });
  });

  describe('handleIncoming', () => {
    it('should process text message and send reply via WhatsappService', async () => {
      const payload: WhatsAppPayload = {
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      from: '123456789',
                      type: 'text',
                      text: { body: 'hola' },
                    },
                  ],
                },
              },
            ],
          },
        ],
      };

      const reply = '👋 ¡Hola! Bienvenido a nuestro asistente virtual.';
      botService.processMessage.mockReturnValue(reply);
      whatsappService.sendTextMessage.mockResolvedValue({
        messaging_product: 'whatsapp',
        contacts: [{ input: '123456789', wa_id: '123456789' }],
        messages: [{ id: 'wamid.HBgL' }],
      });

      const result = await service.handleIncoming(payload);

      expect(botService.processMessage).toHaveBeenCalledWith('hola');
      expect(whatsappService.sendTextMessage).toHaveBeenCalledWith(
        '123456789',
        reply,
      );
      expect(result).toBe('EVENT_RECEIVED');
    });

    it('should handle status updates without sending messages', async () => {
      const payload: WhatsAppPayload = {
        entry: [
          {
            changes: [
              {
                value: {
                  statuses: [{ status: 'delivered' }],
                },
              },
            ],
          },
        ],
      };

      const result = await service.handleIncoming(payload);

      expect(whatsappService.sendTextMessage).not.toHaveBeenCalled();
      expect(result).toBe('EVENT_RECEIVED');
    });

    it('should not throw if whatsappService fails to send message', async () => {
      const payload: WhatsAppPayload = {
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      from: '123456789',
                      type: 'text',
                      text: { body: 'fail' },
                    },
                  ],
                },
              },
            ],
          },
        ],
      };

      botService.processMessage.mockReturnValue('Some reply');
      whatsappService.sendTextMessage.mockRejectedValue(
        new Error('Network error'),
      );

      const result = await service.handleIncoming(payload);

      expect(result).toBe('EVENT_RECEIVED');
    });
  });
});
