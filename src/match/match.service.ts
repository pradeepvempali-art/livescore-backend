import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { BulkCreateMatchDto } from './dto/bulk-create-match.dto';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ CREATE SINGLE MATCH
  async create(dto: CreateMatchDto) {
    if (dto.teamAId === dto.teamBId) {
      throw new BadRequestException('Team A and Team B must be different');
    }

    const teams = await this.prisma.team.findMany({
      where: { id: { in: [dto.teamAId, dto.teamBId] } },
    });

    if (teams.length !== 2) {
      throw new BadRequestException('Invalid teamId(s)');
    }

    const duplicate = await this.prisma.match.findFirst({
      where: {
        title: dto.title,
        teamAId: dto.teamAId,
        teamBId: dto.teamBId,
      },
    });

    if (duplicate) {
      throw new BadRequestException('Match already exists');
    }

    return this.prisma.match.create({
      data: {
        title: dto.title,
        venue: dto.venue,
        tournament: dto.tournament,
        status: 'UPCOMING',
        teamAId: dto.teamAId,
        teamBId: dto.teamBId,
      },
      include: {
        teamA: true,
        teamB: true,
      },
    });
  }

  // ✅ BULK CREATE MATCHES
  async createBulk(dto: BulkCreateMatchDto) {
    if (!dto.matches || !Array.isArray(dto.matches)) {
      throw new BadRequestException('matches array is required');
    }

    return Promise.all(
      dto.matches.map(async (m) => {
        if (m.teamAId === m.teamBId) {
          throw new BadRequestException('Team A and Team B must be different');
        }

        return this.prisma.match.create({
          data: {
            title: m.title,
            venue: m.venue,
            tournament: m.tournament,
            status: 'UPCOMING',
            teamAId: m.teamAId,
            teamBId: m.teamBId,
          },
        });
      }),
    );
  }

  // ✅ GET ALL MATCHES
  findAll() {
    return this.prisma.match.findMany({
      include: {
        teamA: true,
        teamB: true,
        schedule: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ GET MATCH BY ID
  async findOne(id: string) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        teamA: true,
        teamB: true,
        innings: true,
        commentary: true,
      },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    return match;
  }

  // ✅ UPDATE MATCH
  async update(id: string, dto: UpdateMatchDto) {
    const match = await this.prisma.match.findUnique({ where: { id } });
    if (!match) throw new NotFoundException('Match not found');

    return this.prisma.match.update({
      where: { id },
      data: dto,
    });
  }

  // 🔥 UPDATE MATCH SCORE FROM LATEST INNINGS
  async recalcScore(matchId: string) {
    // 1️⃣ Validate match
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    // 2️⃣ Get latest innings
    const innings = await this.prisma.innings.findMany({
      where: { matchId },
      orderBy: { inningsNumber: 'desc' },
      take: 1,
    });

    if (innings.length === 0) {
      throw new NotFoundException('No innings found for this match');
    }

    const current = innings[0];

    // 3️⃣ Calculate score
    const score = `${current.runs}/${current.wickets}`;
    const overs = current.overs.toFixed(1);
    const runRate =
      current.overs > 0 ? Number((current.runs / current.overs).toFixed(2)) : 0;

    // 4️⃣ Update match
    return this.prisma.match.update({
      where: { id: matchId },
      data: {
        score,
        overs,
        runRate,
      },
    });
  }

  // ❌ DELETE MATCH
  async remove(id: string) {
    const match = await this.prisma.match.findUnique({ where: { id } });
    if (!match) throw new NotFoundException('Match not found');

    return this.prisma.match.delete({ where: { id } });
  }
}
