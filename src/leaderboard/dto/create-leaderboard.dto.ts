import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
/* eslint-disable @typescript-eslint/no-unsafe-call */

export class CreateLeaderboardDto {
  @IsString()
  @IsNotEmpty()
  type: string; // runs | wickets | sixes | fours

  @IsInt()
  @Min(0)
  value: number;

  @IsString()
  @IsNotEmpty()
  playerId: string;
}
