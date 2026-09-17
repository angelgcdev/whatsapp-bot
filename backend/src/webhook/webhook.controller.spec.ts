import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import type { WhatsAppPayload } from './interfaces/whatsapp-payload.interface';

describe('WebhookController', () => {
  let controller: WebhookController;
  let webhookService: Partial<Record<keyof WebhookService, jest.Mock>>;

  beforeEach(async () => {
    webhookService = {
      verifyWebhook: jest.fn(),
      handleIncoming: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        {
          provide: WebhookService,
          useValue: webhookService,
        },
      ],
    }).compile();

    controller = module.get<WebhookController>(WebhookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('verifyWebhook', () => {
    it('should delegate verification to WebhookService and return the challenge', () => {
      const mode = 'subscribe';
      const token = 'my_secret_token';
      const challenge = '1158201444';

      webhookService.verifyWebhook!.mockReturnValue(challenge);

      const result = controller.verifyWebhook(mode, token, challenge);

      expect(webhookService.verifyWebhook).toHaveBeenCalledWith(
        mode,
        token,
        challenge,
      );
      expect(result).toBe(challenge);
    });
  });

  describe('handleIncoming', () => {
    it('should delegate payload processing to WebhookService and return EVENT_RECEIVED', async () => {
      const mockPayload: WhatsAppPayload = {
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      from: '123456789',
                      type: 'text',
                      text: { body: 'Hello' },
                    },
                  ],
                },
              },
            ],
          },
        ],
      };

      webhookService.handleIncoming!.mockResolvedValue('EVENT_RECEIVED');

      const result = await controller.handleIncoming(mockPayload);

      expect(webhookService.handleIncoming).toHaveBeenCalledWith(mockPayload);
      expect(result).toBe('EVENT_RECEIVED');
    });
  });
});
