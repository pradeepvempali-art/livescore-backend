import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInningDto } from './dto/create-inning.dto';
import { UpdateInningDto } from './dto/update-inning.dto';

@Injectable()
export class InningsService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ CREATE SINGLE INNINGS
  async create(dto: CreateInningDto) {
    const match = await this.prisma.match.findUnique({
      where: { id: dto.matchId },
    });
    if (!match) throw new BadRequestException('Invalid matchId');

    const team = await this.prisma.team.findUnique({
      where: { id: dto.teamId },
    });
    if (!team) throw new BadRequestException('Invalid teamId');

    const existing = await this.prisma.innings.findFirst({
      where: {
        matchId: dto.matchId,
        inningsNumber: dto.inningsNumber,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Innings ${dto.inningsNumber} already exists for this match`,
      );
    }

    return this.prisma.innings.create({
      data: {
        matchId: dto.matchId,
        teamId: dto.teamId,
        inningsNumber: dto.inningsNumber,
        runs: 0,
        wickets: 0,
        overs: 0,
      },
    });
  }

  // ✅ BULK CREATE INNINGS
  async bulkCreate(dtos: CreateInningDto[]) {
    return this.prisma.innings.createMany({
      data: dtos.map((dto) => ({
        matchId: dto.matchId,
        teamId: dto.teamId,
        inningsNumber: dto.inningsNumber,
        runs: 0,
        wickets: 0,
        overs: 0,
      })),
      skipDuplicates: true,
    });
  }

  // ✅ GET ALL INNINGS
  async findAll() {
    return this.prisma.innings.findMany({
      include: { match: true, team: true },
      orderBy: { inningsNumber: 'asc' },
    });
  }

  // ✅ GET INNINGS BY MATCH
  async findByMatch(matchId: string) {
    return this.prisma.innings.findMany({
      where: { matchId },
      include: { team: true },
      orderBy: { inningsNumber: 'asc' },
    });
  }

  // ✅ GET ONE INNINGS
  async findOne(id: string) {
    const innings = await this.prisma.innings.findUnique({
      where: { id },
      include: { match: true, team: true },
    });

    if (!innings) throw new NotFoundException('Innings not found');
    return innings;
  }

  // ✅ UPDATE INNINGS (ADMIN / MANUAL)
  async update(id: string, dto: UpdateInningDto) {
    const innings = await this.prisma.innings.findUnique({ where: { id } });
    if (!innings) throw new NotFoundException('Innings not found');

    return this.prisma.innings.update({
      where: { id },
      data: dto,
    });
  }

  // 🔥 RECALCULATE INNINGS FROM PLAYER STATS (FIXED LOGIC)
  async recalcInnings(inningsId: string) {
    const innings = await this.prisma.innings.findUnique({
      where: { id: inningsId },
      include: { stats: true },
    });

    if (!innings) throw new NotFoundException('Innings not found');

    const stats = innings.stats;

    const totalRuns = stats.reduce((sum, s) => sum + (s.runs ?? 0), 0);

    const totalWickets = stats.reduce((sum, s) => sum + (s.wickets ?? 0), 0);

    // ✅ Overs must be MAX, not SUM
    const totalOvers =
      stats.length > 0 ? Math.max(...stats.map((s) => s.overs ?? 0)) : 0;

    return this.prisma.innings.update({
      where: { id: inningsId },
      data: {
        runs: totalRuns,
        wickets: totalWickets,
        overs: totalOvers,
      },
    });
  }

  // ✅ DELETE INNINGS
  async remove(id: string) {
    const innings = await this.prisma.innings.findUnique({ where: { id } });
    if (!innings) throw new NotFoundException('Innings not found');

    return this.prisma.innings.delete({ where: { id } });
  }
}
