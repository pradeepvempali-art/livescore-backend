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
import { BulkCreatePlayerStatsDto } from './dto/bulk-create-player-stats.dto';

@Controller('player-stats')
export class PlayerStatsController {
  constructor(private readonly service: PlayerStatsService) {}

  // 🔥 ONLY ENTRY POINT
  @Post('bulk')
  bulkUpsert(@Body() dto: BulkCreatePlayerStatsDto) {
    return this.service.bulkUpsert(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('match/:matchId')
  findByMatch(@Param('matchId') matchId: string) {
    return this.service.findByMatch(matchId);
  }

  @Get('player/:playerId')
  findByPlayer(@Param('playerId') playerId: string) {
    return this.service.findByPlayer(playerId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
