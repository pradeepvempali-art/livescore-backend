/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMatchDto } from './create-match.dto';

export class BulkCreateMatchDto {
  @ValidateNested({ each: true })
  @Type(() => CreateMatchDto)
  @ArrayMinSize(1)
  matches: CreateMatchDto[];
}
