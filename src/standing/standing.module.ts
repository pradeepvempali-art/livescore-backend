import { Module } from '@nestjs/common';
import { StandingService } from './standing.service';
import { StandingController } from './standing.controller';

@Module({
  controllers: [StandingController],
  providers: [StandingService],
})
export class StandingModule {}
