/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/team/dto/create-team.dto.ts
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  shortName: string;

  @IsString()
  @IsNotEmpty()
  coach: string;

  @IsString()
  @IsNotEmpty()
  captain: string;
}
