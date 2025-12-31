import { ArrayMinSize, ValidateNested } from 'class-validator';
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Type } from 'class-transformer';
import { CreateStandingDto } from './create-standing.dto';

export class BulkCreateStandingDto {
  @ValidateNested({ each: true })
  @Type(() => CreateStandingDto)
  @ArrayMinSize(1)
  standings: CreateStandingDto[];
}
