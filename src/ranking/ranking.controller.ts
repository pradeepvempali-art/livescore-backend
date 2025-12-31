import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RankingService } from './ranking.service';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { UpdateRankingDto } from './dto/update-ranking.dto';
import { BulkCreateRankingDto } from './dto/bulk-create-ranking.dto';
import { Query } from '@nestjs/common';

@Controller('rankings')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Post()
  create(@Body() dto: CreateRankingDto) {
    return this.rankingService.create(dto);
  }

  @Post('bulk')
  createBulk(@Body() dto: BulkCreateRankingDto) {
    return this.rankingService.createBulk(dto);
  }

  @Get()
  findAll(@Query('type') type?: 'ODI' | 'T20' | 'TEST') {
    return this.rankingService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rankingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRankingDto) {
    return this.rankingService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rankingService.remove(id);
  }
}
