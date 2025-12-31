/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRankingDto } from './create-ranking.dto';

export class BulkCreateRankingDto {
  @ValidateNested({ each: true })
  @Type(() => CreateRankingDto)
  @ArrayMinSize(1)
  rankings: CreateRankingDto[];
}
