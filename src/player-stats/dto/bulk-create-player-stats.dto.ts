import { ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePlayerStatsDto } from './create-player-stat.dto';

export class BulkCreatePlayerStatsDto {
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePlayerStatsDto)
  stats: CreatePlayerStatsDto[];
}
