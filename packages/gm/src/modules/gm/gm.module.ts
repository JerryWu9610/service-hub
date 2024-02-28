import { Module } from '@nestjs/common';
import { GmController } from './gm.controller';
import { GmService } from './gm.service';

@Module({
  providers: [GmService],
  controllers: [GmController],
})
export class GmModule {}
