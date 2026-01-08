import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  teamAId?: string;
  teamBId?: string;
  venue?: string;
  matchDate?: string;
  status?: string;
  tournamentId?: string;
}
