/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLeaderboardDto } from './create-leaderboard.dto';

export class BulkCreateLeaderboardDto {
  @ValidateNested({ each: true })
  @Type(() => CreateLeaderboardDto)
  @ArrayMinSize(1)
  leaderboards: CreateLeaderboardDto[];
}
