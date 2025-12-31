import { Module } from '@nestjs/common';
import { InningsService } from './innings.service';
import { InningsController } from './innings.controller';

@Module({
  controllers: [InningsController],
  providers: [InningsService],
})
export class InningsModule {}
