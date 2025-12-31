import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MatchResultService } from './match-result.service';
import { CreateMatchResultDto } from './dto/create-match-result.dto';
import { UpdateMatchResultDto } from './dto/update-match-result.dto';
import { BulkCreateMatchResultDto } from './dto/bulk-create-match-result.dto';

@Controller('match-results')
export class MatchResultController {
  constructor(private readonly service: MatchResultService) {}

  // ✅ CREATE SINGLE
  @Post()
  create(@Body() dto: CreateMatchResultDto) {
    return this.service.create(dto);
  }

  // ✅ CREATE BULK
  @Post('bulk')
  bulk(@Body() dto: BulkCreateMatchResultDto) {
    return this.service.bulkCreate(dto.results);
  }

  // ✅ GET ALL (ADMIN / DEBUG)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 🔥 GET RESULT BY MATCH ID (KEY FIX)
  @Get('match/:matchId')
  findByMatch(@Param('matchId') matchId: string) {
    return this.service.findByMatch(matchId);
  }

  // ✅ GET ONE BY RESULT ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ✅ UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMatchResultDto) {
    return this.service.update(id, dto);
  }

  // ✅ DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
