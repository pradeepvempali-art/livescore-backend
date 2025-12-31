import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { UpdateRankingDto } from './dto/update-ranking.dto';
import { BulkCreateRankingDto } from './dto/bulk-create-ranking.dto';

@Injectable()
export class RankingService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ Single create (team + format)
  async create(dto: CreateRankingDto) {
    // Team exists?
    const team = await this.prisma.team.findUnique({
      where: { id: dto.teamId },
    });

    if (!team) {
      throw new BadRequestException('Invalid teamId');
    }

    // ✅ One ranking per team per format
    const existing = await this.prisma.ranking.findUnique({
      where: {
        teamId_type: {
          teamId: dto.teamId,
          type: dto.type,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Ranking already exists for this team and format',
      );
    }

    return this.prisma.ranking.create({
      data: {
        teamId: dto.teamId,
        type: dto.type,
        rating: dto.rating,
      },
    });
  }

  // ✅ Bulk create (team + format safe)
  async createBulk(dto: BulkCreateRankingDto) {
    const payload = dto.rankings;

    // Prevent duplicate teamId + type in request
    const keySet = new Set<string>();

    for (const r of payload) {
      const key = `${r.teamId}_${r.type}`;
      if (keySet.has(key)) {
        throw new BadRequestException(
          `Duplicate ranking in request for teamId ${r.teamId} and type ${r.type}`,
        );
      }
      keySet.add(key);
    }

    // Validate teams exist
    const teamIds = [...new Set(payload.map((r) => r.teamId))];
    const teams = await this.prisma.team.findMany({
      where: { id: { in: teamIds } },
      select: { id: true },
    });

    if (teams.length !== teamIds.length) {
      throw new BadRequestException('One or more teamIds are invalid');
    }

    // Check DB for existing rankings
    const existing = await this.prisma.ranking.findMany({
      where: {
        OR: payload.map((r) => ({
          teamId: r.teamId,
          type: r.type,
        })),
      },
      select: { teamId: true, type: true },
    });

    if (existing.length > 0) {
      throw new BadRequestException(
        'Ranking already exists for some team and format combinations',
      );
    }

    const result = await this.prisma.ranking.createMany({
      data: payload.map((r) => ({
        teamId: r.teamId,
        type: r.type,
        rating: r.rating,
      })),
    });

    return {
      count: result.count,
      message: 'Rankings created successfully',
    };
  }

  async findAll(type?: 'ODI' | 'T20' | 'TEST') {
    return this.prisma.ranking.findMany({
      where: type ? { type } : undefined,
      include: { team: true },
      orderBy: { rating: 'desc' },
    });
  }

  // ✅ Get by ID
  async findOne(id: string) {
    const ranking = await this.prisma.ranking.findUnique({
      where: { id },
      include: { team: true },
    });

    if (!ranking) {
      throw new NotFoundException('Ranking not found');
    }

    return ranking;
  }

  // ✅ Update by ID (format-safe)
  async update(id: string, dto: UpdateRankingDto) {
    const ranking = await this.prisma.ranking.findUnique({
      where: { id },
    });

    if (!ranking) {
      throw new NotFoundException('Ranking not found');
    }

    // Prevent duplicate team + type
    if (
      (dto.teamId && dto.teamId !== ranking.teamId) ||
      (dto.type && dto.type !== ranking.type)
    ) {
      const exists = await this.prisma.ranking.findUnique({
        where: {
          teamId_type: {
            teamId: dto.teamId ?? ranking.teamId,
            type: dto.type ?? ranking.type,
          },
        },
      });

      if (exists) {
        throw new BadRequestException(
          'Ranking already exists for this team and format',
        );
      }
    }

    return this.prisma.ranking.update({
      where: { id },
      data: dto,
    });
  }

  // ✅ Delete
  async remove(id: string) {
    const ranking = await this.prisma.ranking.findUnique({
      where: { id },
    });

    if (!ranking) {
      throw new NotFoundException('Ranking not found');
    }

    await this.prisma.ranking.delete({ where: { id } });

    return { message: 'Ranking deleted successfully' };
  }
}
