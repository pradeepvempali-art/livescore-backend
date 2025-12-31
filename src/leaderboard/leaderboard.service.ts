import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { BulkCreateLeaderboardDto } from './dto/bulk-create-leaderboard.dto';

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ Single create
  async create(dto: CreateLeaderboardDto) {
    // Player exists?
    const player = await this.prisma.player.findUnique({
      where: { id: dto.playerId },
    });

    if (!player) {
      throw new BadRequestException('Invalid playerId');
    }

    // Duplicate check
    const existing = await this.prisma.leaderboard.findFirst({
      where: {
        playerId: dto.playerId,
        type: dto.type,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Leaderboard entry already exists for ${dto.type}`,
      );
    }

    return this.prisma.leaderboard.create({
      data: {
        type: dto.type,
        value: dto.value,
        playerId: dto.playerId,
      },
    });
  }

  // ✅ Bulk create
  async createBulk(dto: BulkCreateLeaderboardDto) {
    const payload = dto.leaderboards;

    // Validate players
    const playerIds = [...new Set(payload.map((l) => l.playerId))];
    const players = await this.prisma.player.findMany({
      where: { id: { in: playerIds } },
      select: { id: true },
    });

    if (players.length !== playerIds.length) {
      throw new BadRequestException('One or more playerIds are invalid');
    }

    // Check duplicates inside request
    const keySet = new Set<string>();
    const duplicates: string[] = [];

    for (const l of payload) {
      const key = `${l.playerId}_${l.type}`;
      if (keySet.has(key)) duplicates.push(l.type);
      keySet.add(key);
    }

    if (duplicates.length > 0) {
      throw new BadRequestException(
        `Duplicate leaderboard entries in request: ${duplicates.join(', ')}`,
      );
    }

    // Check existing DB records
    const existing = await this.prisma.leaderboard.findMany({
      where: {
        OR: payload.map((l) => ({
          playerId: l.playerId,
          type: l.type,
        })),
      },
      select: { type: true },
    });

    if (existing.length > 0) {
      throw new BadRequestException(
        `Leaderboard already exists for types: ${existing
          .map((e) => e.type)
          .join(', ')}`,
      );
    }

    const result = await this.prisma.leaderboard.createMany({
      data: payload.map((l) => ({
        type: l.type,
        value: l.value,
        playerId: l.playerId,
      })),
    });

    return {
      count: result.count,
      message: 'Leaderboard entries created successfully',
    };
  }

  async findAll() {
    return this.prisma.leaderboard.findMany({
      include: {
        player: {
          include: {
            team: true,
          },
        },
      },
      orderBy: { value: 'desc' },
    });
  }

  async findOne(id: string) {
    const leaderboard = await this.prisma.leaderboard.findUnique({
      where: { id },
      include: { player: true },
    });

    if (!leaderboard) {
      throw new NotFoundException('Leaderboard entry not found');
    }

    return leaderboard;
  }

  async update(id: string, dto: UpdateLeaderboardDto) {
    const leaderboard = await this.prisma.leaderboard.findUnique({
      where: { id },
    });

    if (!leaderboard) {
      throw new NotFoundException('Leaderboard entry not found');
    }

    // Prevent duplicate on update
    if (dto.type || dto.playerId) {
      const type = dto.type ?? leaderboard.type;
      const playerId = dto.playerId ?? leaderboard.playerId;

      const duplicate = await this.prisma.leaderboard.findFirst({
        where: {
          type,
          playerId,
          NOT: { id },
        },
      });

      if (duplicate) {
        throw new BadRequestException(
          `Leaderboard entry already exists for ${type}`,
        );
      }
    }

    return this.prisma.leaderboard.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const leaderboard = await this.prisma.leaderboard.findUnique({
      where: { id },
    });

    if (!leaderboard) {
      throw new NotFoundException('Leaderboard entry not found');
    }

    await this.prisma.leaderboard.delete({ where: { id } });

    return { message: 'Leaderboard entry deleted' };
  }
}
