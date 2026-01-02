import { ArrayMinSize, IsArray, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePlayerStatsDto } from './create-player-stat.dto';

export class BulkCreatePlayerStatsDto {
  @IsUUID()
  matchId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePlayerStatsDto)
  stats: CreatePlayerStatsDto[];
}
