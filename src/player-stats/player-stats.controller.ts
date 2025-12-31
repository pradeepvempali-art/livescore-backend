import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PlayerStatsService } from './player-stats.service';
import { CreatePlayerStatsDto } from './dto/create-player-stat.dto';
import { UpdatePlayerStatsDto } from './dto/update-player-stat.dto';
import { BulkCreatePlayerStatsDto } from './dto/bulk-create-player-stats.dto';

@Controller('player-stats')
export class PlayerStatsController {
  constructor(private readonly service: PlayerStatsService) {}

  // ✅ CREATE SINGLE (rarely used manually)
  @Post()
  create(@Body() dto: CreatePlayerStatsDto) {
    return this.service.create(dto);
  }

  // 🔥 BULK UPSERT (MAIN FEATURE)
  @Post('bulk')
  bulkUpsert(@Body() dto: BulkCreatePlayerStatsDto) {
    return this.service.bulkUpsert(dto);
  }

  // ✅ GET ALL
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ✅ GET BY MATCH
  @Get('match/:matchId')
  findByMatch(@Param('matchId') matchId: string) {
    return this.service.findByMatch(matchId);
  }

  // ✅ GET BY PLAYER
  @Get('player/:playerId')
  findByPlayer(@Param('playerId') playerId: string) {
    return this.service.findByPlayer(playerId);
  }

  // ✅ UPDATE SINGLE STAT ROW
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlayerStatsDto) {
    return this.service.update(id, dto);
  }

  // ✅ DELETE SINGLE STAT ROW
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
