/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  matchId: string;

  @IsDateString()
  date: string; // ISO string
}
