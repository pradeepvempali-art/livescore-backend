import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
/* eslint-disable @typescript-eslint/no-unsafe-call */

export class CreateStandingDto {
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @IsInt()
  @Min(0)
  played: number;

  @IsInt()
  @Min(0)
  won: number;

  @IsInt()
  @Min(0)
  lost: number;

  @IsInt()
  @Min(0)
  points: number;

  @IsNumber()
  nrr: number; // Net Run Rate
}
