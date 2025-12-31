import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerStatsDto } from './create-player-stat.dto';

export class UpdatePlayerStatsDto extends PartialType(CreatePlayerStatsDto) {}
