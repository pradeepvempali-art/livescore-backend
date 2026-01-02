import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateMatchDto } from './create-match.dto';

export class BulkCreateMatchDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateMatchDto)
  matches: CreateMatchDto[];
}
