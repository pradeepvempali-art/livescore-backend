import { Module } from '@nestjs/common';
import { WicketService } from './wicket.service';
import { WicketController } from './wicket.controller';

@Module({
  controllers: [WicketController],
  providers: [WicketService],
})
export class WicketModule {}
