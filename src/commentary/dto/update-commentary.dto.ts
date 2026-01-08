// src/commentary/dto/update-commentary.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentaryDto } from './create-commentary.dto';

export class UpdateCommentaryDto extends PartialType(CreateCommentaryDto) {
  matchId?: string;
  inningId?: string;
  over?: number;
  ball?: number;
  text?: string;
  type?: string;
}
