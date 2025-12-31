// src/player/dto/create-player.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  role: string; // Batsman | Bowler | All-Rounder | Wicket-Keeper

  @IsOptional()
  @IsString()
  battingStyle?: string;

  @IsOptional()
  @IsString()
  bowlingStyle?: string;

  @IsString()
  @IsNotEmpty()
  teamId: string;
}
