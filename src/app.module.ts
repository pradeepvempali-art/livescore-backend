// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TeamModule } from './team/team.module';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { ScheduleModule } from './schedule/schedule.module';
import { CommentaryModule } from './commentary/commentary.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { RankingModule } from './ranking/ranking.module';
import { StandingModule } from './standing/standing.module';
import { InningsModule } from './innings/innings.module';
import { WicketModule } from './wicket/wicket.module';
import { MatchResultModule } from './match-result/match-result.module';
import { PlayerStatsModule } from './player-stats/player-stats.module';
// later: PlayerModule, MatchModule, etc

@Module({
  imports: [
    PrismaModule,
    TeamModule,
    PlayerModule,
    MatchModule,
    ScheduleModule,
    CommentaryModule,
    LeaderboardModule,
    RankingModule,
    StandingModule,
    InningsModule,
    WicketModule,
    MatchResultModule,
    PlayerStatsModule,
  ],
})
export class AppModule {}
