import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
/* eslint-disable @typescript-eslint/no-unsafe-call */

export class CreateRankingDto {
  @IsString()
  @IsNotEmpty()
  type: string; // ODI | T20 | TEST

  @IsInt()
  @Min(0)
  rating: number;

  @IsString()
  @IsNotEmpty()
  teamId: string;
}
