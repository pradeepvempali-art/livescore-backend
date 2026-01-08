// src/wicket/dto/update-wicket.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateWicketDto } from './create-wicket.dto';

export class UpdateWicketDto extends PartialType(CreateWicketDto) {
  matchId?: string;
  inningId?: string;
  bowlerId?: string;
  batsmanId?: string;
  wicketType?: string;
  over?: number;
  ball?: number;
}
