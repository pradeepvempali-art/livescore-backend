import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { InningsService } from './innings.service';
import { CreateInningDto } from './dto/create-inning.dto';
import { UpdateInningDto } from './dto/update-inning.dto';

@Controller('innings')
export class InningsController {
  constructor(private readonly service: InningsService) {}

  // ✅ CREATE
  @Post()
  create(@Body() dto: CreateInningDto) {
    return this.service.create(dto);
  }

  // ✅ BULK CREATE
  @Post('bulk')
  bulkCreate(@Body() dtos: CreateInningDto[]) {
    return this.service.bulkCreate(dtos);
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

  // ✅ GET ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ✅ UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInningDto) {
    return this.service.update(id, dto);
  }

  // 🔥 RECALCULATE INNINGS
  @Patch(':id/recalc')
  recalc(@Param('id') id: string) {
    return this.service.recalcInnings(id);
  }

  // ✅ DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
