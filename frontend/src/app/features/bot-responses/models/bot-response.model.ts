export interface BotResponse {
  id: number;
  keyword: string;
  response: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBotResponseDto {
  keyword: string;
  response: string;
  isActive?: boolean;
}

export interface UpdateBotResponseDto {
  keyword?: string;
  response?: string;
  isActive?: boolean;
}
