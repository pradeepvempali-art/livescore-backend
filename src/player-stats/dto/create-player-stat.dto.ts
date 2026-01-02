import { IsInt, IsOptional, IsUUID } from 'class-validator';

export class CreatePlayerStatsDto {
  @IsUUID()
  playerId: string;

  @IsOptional()
  @IsUUID()
  inningsId?: string;

  // Batting
  @IsOptional()
  @IsInt()
  runs?: number;

  @IsOptional()
  @IsInt()
  ballsFaced?: number;

  @IsOptional()
  @IsInt()
  fours?: number;

  @IsOptional()
  @IsInt()
  sixes?: number;

  // Bowling
  @IsOptional()
  overs?: number;

  @IsOptional()
  @IsInt()
  runsConceded?: number;

  @IsOptional()
  @IsInt()
  wickets?: number;
}
