import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentaryService } from './commentary.service';
import { CreateCommentaryDto } from './dto/create-commentary.dto';
import { UpdateCommentaryDto } from './dto/update-commentary.dto';
import { BulkCreateCommentaryDto } from './dto/bulk-create-commentary.dto';

@Controller('commentary')
export class CommentaryController {
  constructor(private readonly commentaryService: CommentaryService) {}

  // CREATE SINGLE
  @Post()
  create(@Body() dto: CreateCommentaryDto) {
    return this.commentaryService.create(dto);
  }

  // CREATE BULK
  @Post('bulk')
  createBulk(@Body() dto: BulkCreateCommentaryDto) {
    return this.commentaryService.createBulk(dto);
  }

  // 🔥 GET COMMENTARY BY MATCH (IMPORTANT)
  @Get('match/:matchId')
  findByMatch(@Param('matchId') matchId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.commentaryService.findByMatch(matchId);
  }

  // GET ALL (ADMIN)
  @Get()
  findAll() {
    return this.commentaryService.findAll();
  }

  // GET ONE COMMENTARY (BY COMMENTARY ID)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentaryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCommentaryDto) {
    return this.commentaryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentaryService.remove(id);
  }
}
