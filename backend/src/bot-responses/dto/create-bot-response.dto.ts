import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBotResponseDto {
  @IsString()
  @IsNotEmpty()
  keyword!: string;

  @IsString()
  @IsNotEmpty()
  response!: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
