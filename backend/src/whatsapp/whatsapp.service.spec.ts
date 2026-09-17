import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { WhatsappService } from './whatsapp.service';

describe('WhatsappService', () => {
  let service: WhatsappService;
  let configService: { get: jest.Mock };

  beforeEach(async () => {
    configService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsappService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<WhatsappService>(WhatsappService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendTextMessage', () => {
    const mockToken = 'test_access_token';
    const mockPhoneId = '1234567890';
    const recipient = '54911223344';
    const message = 'Hello from unit test';

    beforeEach(() => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'WHATSAPP_TOKEN') return mockToken;
        if (key === 'WHATSAPP_PHONE_NUMBER_ID') return mockPhoneId;
        return null;
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should call Meta Graph API with correct URL, headers and payload', async () => {
      const mockMetaResponse = {
        messaging_product: 'whatsapp',
        contacts: [{ input: recipient, wa_id: recipient }],
        messages: [{ id: 'wamid.test_id_123' }],
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockMetaResponse),
      });

      const result = await service.sendTextMessage(recipient, message);

      const expectedUrl = `https://graph.facebook.com/v22.0/${mockPhoneId}/messages`;
      const expectedPayload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,
        type: 'text',
        text: {
          preview_url: false,
          body: message,
        },
      };

      expect(global.fetch).toHaveBeenCalledWith(expectedUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${mockToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expectedPayload),
      });
      expect(result).toEqual(mockMetaResponse);
    });

    it('should throw an error when Meta Graph API returns an error status', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({
          error: { message: 'Invalid OAuth access token' },
        }),
      });

      await expect(service.sendTextMessage(recipient, message)).rejects.toThrow(
        'WhatsApp API responded with status 400',
      );
    });

    it('should propagate unexpected network errors', async () => {
      global.fetch = jest
        .fn()
        .mockRejectedValue(new Error('Network connection timeout'));

      await expect(service.sendTextMessage(recipient, message)).rejects.toThrow(
        'Network connection timeout',
      );
    });
  });
});
