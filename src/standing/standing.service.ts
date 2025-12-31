import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStandingDto } from './dto/create-standing.dto';
import { UpdateStandingDto } from './dto/update-standing.dto';
import { BulkCreateStandingDto } from './dto/bulk-create-standing.dto';

@Injectable()
export class StandingService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ Single create
  async create(dto: CreateStandingDto) {
    // Team exists?
    const team = await this.prisma.team.findUnique({
      where: { id: dto.teamId },
    });

    if (!team) {
      throw new BadRequestException('Invalid teamId');
    }

    // One standing per team
    const existing = await this.prisma.standing.findUnique({
      where: { teamId: dto.teamId },
    });

    if (existing) {
      throw new BadRequestException('Standing already exists for this team');
    }

    return this.prisma.standing.create({
      data: {
        teamId: dto.teamId,
        played: dto.played,
        won: dto.won,
        lost: dto.lost,
        points: dto.points,
        nrr: dto.nrr,
      },
    });
  }

  // ✅ Bulk create
  async createBulk(dto: BulkCreateStandingDto) {
    const payload = dto.standings;

    // Check duplicate teamIds inside request
    const seen = new Set<string>();
    for (const s of payload) {
      if (seen.has(s.teamId)) {
        throw new BadRequestException('Duplicate teamId found in request');
      }
      seen.add(s.teamId);
    }

    // Validate teamIds
    const teamIds = payload.map((s) => s.teamId);
    const teams = await this.prisma.team.findMany({
      where: { id: { in: teamIds } },
      select: { id: true },
    });

    if (teams.length !== teamIds.length) {
      throw new BadRequestException('One or more teamIds are invalid');
    }

    // Check existing standings
    const existing = await this.prisma.standing.findMany({
      where: { teamId: { in: teamIds } },
      select: { teamId: true },
    });

    if (existing.length > 0) {
      throw new BadRequestException(
        'Standing already exists for one or more teams',
      );
    }

    const result = await this.prisma.standing.createMany({
      data: payload.map((s) => ({
        teamId: s.teamId,
        played: s.played,
        won: s.won,
        lost: s.lost,
        points: s.points,
        nrr: s.nrr,
      })),
    });

    return {
      count: result.count,
      message: 'Standings created successfully',
    };
  }

  async findAll() {
    return this.prisma.standing.findMany({
      include: { team: true },
      orderBy: [{ points: 'desc' }, { nrr: 'desc' }],
    });
  }

  async findOne(id: string) {
    const standing = await this.prisma.standing.findUnique({
      where: { id },
      include: { team: true },
    });

    if (!standing) {
      throw new NotFoundException('Standing not found');
    }

    return standing;
  }

  async update(id: string, dto: UpdateStandingDto) {
    const standing = await this.prisma.standing.findUnique({
      where: { id },
    });

    if (!standing) {
      throw new NotFoundException('Standing not found');
    }

    // Prevent switching to another team that already has standing
    if (dto.teamId && dto.teamId !== standing.teamId) {
      const existing = await this.prisma.standing.findUnique({
        where: { teamId: dto.teamId },
      });

      if (existing) {
        throw new BadRequestException('Standing already exists for that team');
      }
    }

    return this.prisma.standing.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const standing = await this.prisma.standing.findUnique({
      where: { id },
    });

    if (!standing) {
      throw new NotFoundException('Standing not found');
    }

    await this.prisma.standing.delete({ where: { id } });

    return { message: 'Standing deleted successfully' };
  }
}
