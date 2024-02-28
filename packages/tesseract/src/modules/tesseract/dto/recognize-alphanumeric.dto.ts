import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBase64, IsObject, IsOptional } from 'class-validator';

export class RecognizeAlphanumericDto {
  @ApiProperty()
  @IsBase64()
  data: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  params?: Record<string, any>;
}
