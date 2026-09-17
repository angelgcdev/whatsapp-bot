import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { WhatsappService } from '../src/whatsapp/whatsapp.service';

describe('WebhookController (e2e)', () => {
  let app: INestApplication<App>;
  const mockWhatsappService = {
    sendTextMessage: jest.fn().mockResolvedValue({
      messaging_product: 'whatsapp',
      contacts: [{ input: '123456', wa_id: '123456' }],
      messages: [{ id: 'wamid.test' }],
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(WhatsappService)
      .useValue(mockWhatsappService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /webhook (Verification Handshake)', () => {
    it('should return challenge and 200 OK with valid verify token', () => {
      const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'test_token';
      const challenge = '99887766';

      return request(app.getHttpServer())
        .get(
          `/webhook?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=${challenge}`,
        )
        .expect(200)
        .expect(challenge);
    });

    it('should return 403 Forbidden with invalid verify token', () => {
      return request(app.getHttpServer())
        .get(
          '/webhook?hub.mode=subscribe&hub.verify_token=wrong_token&hub.challenge=123',
        )
        .expect(403);
    });
  });

  describe('POST /webhook (Incoming Messages)', () => {
    it('should receive text message, process it with bot and return 200 EVENT_RECEIVED', async () => {
      const incomingPayload = {
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      from: '54911223344',
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

      await request(app.getHttpServer())
        .post('/webhook')
        .send(incomingPayload)
        .expect(200)
        .expect('EVENT_RECEIVED');

      expect(mockWhatsappService.sendTextMessage).toHaveBeenCalledWith(
        '54911223344',
        expect.stringContaining('Hola! Bienvenido'),
      );
    });
  });
});
