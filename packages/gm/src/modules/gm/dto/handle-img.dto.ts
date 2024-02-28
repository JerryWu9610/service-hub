import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsMimeType, IsString } from 'class-validator';

export class HandleImgDto {
  @ApiProperty()
  @IsMimeType()
  type: string;

  @ApiProperty()
  @IsBase64()
  data: string;

  @ApiProperty()
  @IsString({
    each: true,
  })
  commands: string[];
}
