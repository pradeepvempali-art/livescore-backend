// src/player/dto/bulk-create-player.dto.ts
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePlayerDto } from './create-player.dto';

export class BulkCreatePlayerDto {
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePlayerDto)
  players: CreatePlayerDto[];
}
