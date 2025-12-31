import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { BulkCreateLeaderboardDto } from './dto/bulk-create-leaderboard.dto';

@Controller('leaderboards')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Post()
  create(@Body() dto: CreateLeaderboardDto) {
    return this.leaderboardService.create(dto);
  }

  @Post('bulk')
  createBulk(@Body() dto: BulkCreateLeaderboardDto) {
    return this.leaderboardService.createBulk(dto);
  }

  @Get()
  findAll() {
    return this.leaderboardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaderboardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLeaderboardDto) {
    return this.leaderboardService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaderboardService.remove(id);
  }
}
