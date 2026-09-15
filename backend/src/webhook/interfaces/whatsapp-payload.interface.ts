export interface WhatsAppPayload {
  entry?: {
    changes?: {
      value?: {
        messages?: {
          from: string;
          type: string;
          text?: { body: string };
        }[];
        statuses?: {
          status: string;
        }[];
      };
    }[];
  }[];
}
