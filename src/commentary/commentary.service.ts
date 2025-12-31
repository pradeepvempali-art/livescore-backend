import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentaryDto } from './dto/create-commentary.dto';
import { UpdateCommentaryDto } from './dto/update-commentary.dto';
import { BulkCreateCommentaryDto } from './dto/bulk-create-commentary.dto';

@Injectable()
export class CommentaryService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ CREATE SINGLE COMMENTARY (BALL)
  async create(dto: CreateCommentaryDto) {
    if (!dto.matchId) {
      throw new BadRequestException('matchId is required');
    }

    const match = await this.prisma.match.findUnique({
      where: { id: dto.matchId },
    });

    if (!match) {
      throw new BadRequestException('Invalid matchId');
    }

    const existing = await this.prisma.commentary.findFirst({
      where: {
        matchId: dto.matchId,
        over: dto.over,
        ball: dto.ball,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Commentary already exists for over ${dto.over}.${dto.ball}`,
      );
    }

    return this.prisma.commentary.create({
      data: {
        matchId: dto.matchId,
        over: dto.over,
        ball: dto.ball,
        runs: dto.runs,
        text: dto.text,
      },
    });
  }

  // ✅ CREATE BULK COMMENTARY
  async createBulk(dto: BulkCreateCommentaryDto) {
    const payload = dto.commentaries;

    if (!payload || payload.length === 0) {
      throw new BadRequestException('commentaries array is required');
    }

    const matchIds = [...new Set(payload.map((c) => c.matchId))];

    const matches = await this.prisma.match.findMany({
      where: { id: { in: matchIds } },
      select: { id: true },
    });

    if (matches.length !== matchIds.length) {
      throw new BadRequestException('One or more matchIds are invalid');
    }

    const keySet = new Set<string>();
    const duplicates: string[] = [];

    for (const c of payload) {
      const key = `${c.matchId}_${c.over}_${c.ball}`;
      if (keySet.has(key)) duplicates.push(`${c.over}.${c.ball}`);
      keySet.add(key);
    }

    if (duplicates.length > 0) {
      throw new BadRequestException(
        `Duplicate commentary in request: ${duplicates.join(', ')}`,
      );
    }

    const existing = await this.prisma.commentary.findMany({
      where: {
        OR: payload.map((c) => ({
          matchId: c.matchId,
          over: c.over,
          ball: c.ball,
        })),
      },
      select: { over: true, ball: true },
    });

    if (existing.length > 0) {
      throw new BadRequestException(
        `Commentary already exists for balls: ${existing
          .map((e) => `${e.over}.${e.ball}`)
          .join(', ')}`,
      );
    }

    const result = await this.prisma.commentary.createMany({
      data: payload.map((c) => ({
        matchId: c.matchId,
        over: c.over,
        ball: c.ball,
        runs: c.runs,
        text: c.text,
      })),
    });

    return {
      count: result.count,
      message: 'Commentary added successfully',
    };
  }

  // 🔥 GET COMMENTARY FOR A SINGLE MATCH (THIS FIXES YOUR BUG)
  async findByMatch(matchId: string) {
    if (!matchId) {
      throw new BadRequestException('matchId is required');
    }

    return this.prisma.commentary.findMany({
      where: { matchId },
      orderBy: [{ over: 'asc' }, { ball: 'asc' }],
    });
  }

  // ✅ GET ALL COMMENTARY (ADMIN / DEBUG)
  async findAll() {
    return this.prisma.commentary.findMany({
      include: { match: true },
      orderBy: [{ over: 'asc' }, { ball: 'asc' }],
    });
  }

  // ✅ GET SINGLE COMMENTARY BY COMMENTARY ID
  async findOne(id: string) {
    const commentary = await this.prisma.commentary.findUnique({
      where: { id },
      include: { match: true },
    });

    if (!commentary) {
      throw new NotFoundException('Commentary not found');
    }

    return commentary;
  }

  // ✅ UPDATE COMMENTARY
  async update(id: string, dto: UpdateCommentaryDto) {
    const commentary = await this.prisma.commentary.findUnique({
      where: { id },
    });

    if (!commentary) {
      throw new NotFoundException('Commentary not found');
    }

    return this.prisma.commentary.update({
      where: { id },
      data: dto,
    });
  }

  // ✅ DELETE COMMENTARY
  async remove(id: string) {
    const commentary = await this.prisma.commentary.findUnique({
      where: { id },
    });

    if (!commentary) {
      throw new NotFoundException('Commentary not found');
    }

    await this.prisma.commentary.delete({
      where: { id },
    });

    return { message: 'Commentary deleted successfully' };
  }
}
