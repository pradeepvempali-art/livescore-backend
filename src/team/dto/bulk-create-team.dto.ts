/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Type } from 'class-transformer';
import { ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateTeamDto } from './create-team.dto';

export class BulkCreateTeamDto {
  @ValidateNested({ each: true })
  @Type(() => CreateTeamDto)
  @ArrayMinSize(1)
  teams: CreateTeamDto[];
}
