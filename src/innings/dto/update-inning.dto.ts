import { PartialType } from '@nestjs/mapped-types';
import { CreateInningDto } from './create-inning.dto';

export class UpdateInningDto extends PartialType(CreateInningDto) {
  matchId?: string;
  teamId?: string;
  inningNumber?: number;
  runs?: number;
  wickets?: number;
  overs?: number;
  isCompleted?: boolean;
}
