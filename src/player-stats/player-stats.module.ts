import { Module } from '@nestjs/common';
import { PlayerStatsService } from './player-stats.service';
import { PlayerStatsController } from './player-stats.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PlayerStatsController],
  providers: [PlayerStatsService, PrismaService],
})
export class PlayerStatsModule {}
