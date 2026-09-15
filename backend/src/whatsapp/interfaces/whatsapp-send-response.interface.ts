export interface WhatsAppContact {
  input: string;
  wa_id: string;
}

export interface WhatsAppSentMessage {
  id: string;
}

export interface WhatsAppSendMessageResponse {
  messaging_product: string;
  contacts: WhatsAppContact[];
  messages: WhatsAppSentMessage[];
}
