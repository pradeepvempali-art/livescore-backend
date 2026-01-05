import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchResultDto } from './dto/create-match-result.dto';
import { UpdateMatchResultDto } from './dto/update-match-result.dto';

@Injectable()
export class MatchResultService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ CREATE SINGLE RESULT
  async create(dto: CreateMatchResultDto) {
    const match = await this.prisma.match.findUnique({
      where: { id: dto.matchId },
    });

    if (!match) {
      throw new BadRequestException('Invalid matchId');
    }

    const existing = await this.prisma.matchResult.findUnique({
      where: { matchId: dto.matchId },
    });

    if (existing) {
      throw new BadRequestException(
        'Match result already exists for this match',
      );
    }

    const result = await this.prisma.matchResult.create({
      data: {
        matchId: dto.matchId,
        winnerTeamId: dto.winnerTeamId,
        playerOfMatchId: dto.playerOfMatchId,
        resultType: dto.resultType,
        summary: dto.summary,
      },
      include: {
        winnerTeam: true,
        playerOfMatch: true,
      },
    });

    // 🔥 UPDATE MATCH STATUS
    await this.prisma.match.update({
      where: { id: dto.matchId },
      data: { status: 'COMPLETED' },
    });

    return result;
  }

  // ✅ BULK CREATE (SEED / ADMIN ONLY)
  async bulkCreate(dtos: CreateMatchResultDto[]) {
    return this.prisma.matchResult.createMany({
      data: dtos.map((dto) => ({
        matchId: dto.matchId,
        winnerTeamId: dto.winnerTeamId,
        playerOfMatchId: dto.playerOfMatchId,
        resultType: dto.resultType,
        summary: dto.summary,
      })),
      skipDuplicates: true, // relies on matchId @unique
    });
  }

  // ✅ GET RESULT BY MATCH (FRONTEND)
  async findByMatch(matchId: string) {
    return this.prisma.matchResult.findUnique({
      where: { matchId },
      include: {
        winnerTeam: true,
        playerOfMatch: true,
      },
    });
  }

  // ✅ ADMIN: GET ALL RESULTS
  findAll() {
    return this.prisma.matchResult.findMany({
      include: {
        match: true,
        winnerTeam: true,
        playerOfMatch: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ GET RESULT BY ID
  async findOne(id: string) {
    const result = await this.prisma.matchResult.findUnique({
      where: { id },
      include: {
        match: true,
        winnerTeam: true,
        playerOfMatch: true,
      },
    });

    if (!result) {
      throw new NotFoundException('Match result not found');
    }

    return result;
  }

  // ✅ UPDATE RESULT
  update(id: string, dto: UpdateMatchResultDto) {
    return this.prisma.matchResult.update({
      where: { id },
      data: dto,
      include: {
        winnerTeam: true,
        playerOfMatch: true,
      },
    });
  }

  // ✅ DELETE RESULT (OPTIONAL ROLLBACK)
  async remove(id: string) {
    const result = await this.prisma.matchResult.findUnique({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('Match result not found');
    }

    await this.prisma.match.update({
      where: { id: result.matchId },
      data: { status: 'LIVE' },
    });

    return this.prisma.matchResult.delete({ where: { id } });
  }
}
