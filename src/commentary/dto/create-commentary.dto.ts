/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateCommentaryDto {
  @IsString()
  @IsNotEmpty()
  matchId: string;

  @IsInt()
  @Min(0)
  over: number;

  @IsInt()
  @Min(1)
  ball: number;

  @IsString()
  @IsNotEmpty()
  runs: string; // "0" | "1" | "4" | "6" | "W" | "NB"

  @IsString()
  @IsNotEmpty()
  text: string;
}
