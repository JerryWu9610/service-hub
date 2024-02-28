import { Body, Controller, Post } from '@nestjs/common';
import { RecognizeAlphanumericDto } from './dto/recognize-alphanumeric.dto';
import { TesseractService } from './tesseract.service';

@Controller('tesseract')
export class TesseractController {
  constructor(private readonly tesseractService: TesseractService) {}

  @Post('/recognize_alphanumeric')
  async recognizeAlphanumeric(@Body() body: RecognizeAlphanumericDto) {
    return await this.tesseractService.recognizeAlphanumeric({
      data: body.data,
      params: body.params,
    });
  }
}
