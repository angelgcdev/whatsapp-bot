export interface WhatsAppMessage {
  from: string;
  type: string;
  text?: { body: string };
}

export interface WhatsAppStatus {
  status: string;
}

export interface WhatsAppPayload {
  entry?: {
    changes?: {
      value?: {
        contacts?: {
          profile?: {
            name?: string;
          };
          wa_id?: string;
        }[];
        messages?: WhatsAppMessage[];
        statuses?: WhatsAppStatus[];
      };
    }[];
  }[];
}
