import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInningDto } from './create-inning.dto';

export class BulkCreateInningDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateInningDto)
  innings: CreateInningDto[];
}
