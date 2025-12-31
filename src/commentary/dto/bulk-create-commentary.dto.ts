/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCommentaryDto } from './create-commentary.dto';

export class BulkCreateCommentaryDto {
  @ValidateNested({ each: true })
  @Type(() => CreateCommentaryDto)
  @ArrayMinSize(1)
  commentaries: CreateCommentaryDto[];
}
