import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreatePlayerStatsDto {
  @IsString()
  playerId: string;

  @IsString()
  matchId: string;

  @IsOptional()
  @IsString()
  inningsId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  runs?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  ballsFaced?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  fours?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  sixes?: number;

  @IsOptional()
  wickets?: number;

  @IsOptional()
  overs?: number;

  @IsOptional()
  runsConceded?: number;
}
