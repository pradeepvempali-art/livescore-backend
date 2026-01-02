/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateScheduleDto {
  @IsUUID()
  matchId: string;

  @IsDateString() // YYYY-MM-DD
  matchDate: string;

  @IsString()
  @IsNotEmpty() // HH:mm
  startTime: string;
}
