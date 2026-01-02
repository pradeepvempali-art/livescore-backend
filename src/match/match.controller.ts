import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { BulkCreateMatchDto } from './dto/bulk-create-match.dto';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  create(@Body() dto: CreateMatchDto) {
    return this.matchService.create(dto);
  }

  @Post('bulk')
  createBulk(@Body() dto: BulkCreateMatchDto) {
    return this.matchService.createBulk(dto);
  }

  @Get()
  findAll() {
    return this.matchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMatchDto) {
    return this.matchService.update(id, dto);
  }

  // 🔥🔥 THIS IS WHAT YOU WERE MISSING 🔥🔥
  @Patch(':id/recalc-score')
  recalcScore(@Param('id') id: string) {
    return this.matchService.recalcScore(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchService.remove(id);
  }
}
