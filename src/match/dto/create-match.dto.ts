/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMatchDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  venue: string;

  @IsOptional()
  @IsString()
  tournament?: string;

  @IsString()
  @IsNotEmpty()
  status: string; // Scheduled | Live | Finished

  @IsString()
  @IsNotEmpty()
  teamAId: string;

  @IsString()
  @IsNotEmpty()
  teamBId: string;
}
