// src/player/dto/update-player.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerDto } from './create-player.dto';

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {
  name?: string;
  role?: string;
  battingStyle?: string;
  bowlingStyle?: string;
  teamId?: string;
}
