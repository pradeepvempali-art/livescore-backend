import { ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateScheduleDto } from './create-schedule.dto';

export class BulkCreateScheduleDto {
  @ValidateNested({ each: true })
  @Type(() => CreateScheduleDto)
  @ArrayMinSize(1)
  schedules: CreateScheduleDto[];
}
