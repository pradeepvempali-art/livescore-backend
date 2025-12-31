import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StandingService } from './standing.service';
import { CreateStandingDto } from './dto/create-standing.dto';
import { UpdateStandingDto } from './dto/update-standing.dto';
import { BulkCreateStandingDto } from './dto/bulk-create-standing.dto';

@Controller('standings')
export class StandingController {
  constructor(private readonly standingService: StandingService) {}

  @Post()
  create(@Body() dto: CreateStandingDto) {
    return this.standingService.create(dto);
  }

  @Post('bulk')
  createBulk(@Body() dto: BulkCreateStandingDto) {
    return this.standingService.createBulk(dto);
  }

  @Get()
  findAll() {
    return this.standingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.standingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStandingDto) {
    return this.standingService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.standingService.remove(id);
  }
}
