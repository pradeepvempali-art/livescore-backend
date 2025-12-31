import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WicketService } from './wicket.service';
import { CreateWicketDto } from './dto/create-wicket.dto';
import { UpdateWicketDto } from './dto/update-wicket.dto';
import { BulkCreateWicketDto } from './dto/bulk-create-wicket.dto';

@Controller('wickets')
export class WicketController {
  constructor(private readonly wicketService: WicketService) {}

  // ✅ SINGLE CREATE
  @Post()
  create(@Body() dto: CreateWicketDto) {
    return this.wicketService.create(dto);
  }

  // ✅ BULK CREATE
  @Post('bulk')
  bulkCreate(@Body() dto: BulkCreateWicketDto) {
    return this.wicketService.bulkCreate(dto.wickets);
  }

  // ✅ FIND ALL
  @Get()
  findAll() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.wicketService.findAll();
  }

  // ✅ FIND ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.wicketService.findOne(id);
  }

  // ✅ UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWicketDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.wicketService.update(id, dto);
  }

  // ✅ DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.wicketService.remove(id);
  }
}
