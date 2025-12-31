import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InningsService } from './innings.service';
import { CreateInningDto } from './dto/create-inning.dto';
import { UpdateInningDto } from './dto/update-inning.dto';

import { BulkCreateInningDto } from './dto/bulk-create-innings.dto';

@Controller('innings')
export class InningsController {
  constructor(private readonly inningsService: InningsService) {}

  // ✅ SINGLE CREATE
  @Post()
  create(@Body() dto: CreateInningDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.inningsService.create(dto);
  }

  // ✅ BULK CREATE
  @Post('bulk')
  bulkCreate(@Body() dto: BulkCreateInningDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.inningsService.bulkCreate(dto.innings);
  }

  // ✅ FIND ALL
  @Get()
  findAll() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.inningsService.findAll();
  }

  // 🔥 GET INNINGS BY MATCH
  @Get('match/:matchId')
  findByMatch(@Param('matchId') matchId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.inningsService.findByMatch(matchId);
  }

  // ✅ FIND ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.inningsService.findOne(id);
  }

  // ✅ UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInningDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.inningsService.update(id, dto);
  }

  // ✅ DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.inningsService.remove(id);
  }
}
