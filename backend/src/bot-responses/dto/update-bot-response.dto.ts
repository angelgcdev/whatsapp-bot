import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateBotResponseDto {
  @IsString()
  @IsOptional()
  keyword?: string;

  @IsString()
  @IsOptional()
  response?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
