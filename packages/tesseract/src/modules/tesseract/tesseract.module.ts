import { Module } from '@nestjs/common';
import { TesseractController } from './tesseract.controller';
import { TesseractService } from './tesseract.service';

@Module({
  controllers: [TesseractController],
  providers: [TesseractService]
})
export class TesseractModule {}
