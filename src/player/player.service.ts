// src/player/player.service.ts

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BulkCreatePlayerDto } from './dto/bulk-create-player.dto';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}

  // 🔒 Prisma unique error handler
  private handlePrismaError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Player already exists');
      }
    }
    throw error;
  }

  // ✅ Create single player (PURE ENTITY)
  async create(dto: CreatePlayerDto) {
    // check team exists
    const team = await this.prisma.team.findUnique({
      where: { id: dto.teamId },
    });

    if (!team) {
      throw new BadRequestException('Invalid teamId');
    }

    // check duplicate (name + team)
    const exists = await this.prisma.player.findFirst({
      where: {
        name: dto.name,
        teamId: dto.teamId,
      },
    });

    if (exists) {
      throw new ConflictException(
        'Player with this name already exists in the team',
      );
    }

    try {
      return await this.prisma.player.create({
        data: {
          name: dto.name,
          role: dto.role,
          battingStyle: dto.battingStyle,
          bowlingStyle: dto.bowlingStyle,
          teamId: dto.teamId,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // ✅ Bulk create players (PURE ENTITY)
  async bulkCreate(dto: BulkCreatePlayerDto) {
    const players = dto.players;

    // 1️⃣ check duplicates inside request
    const keys = players.map(
      (p) => `${p.name.trim().toLowerCase()}-${p.teamId}`,
    );
    if (new Set(keys).size !== keys.length) {
      throw new BadRequestException(
        'Duplicate players in request (same name & team)',
      );
    }

    // 2️⃣ check existing players in DB
    const existing = await this.prisma.player.findMany({
      where: {
        OR: players.map((p) => ({
          name: p.name,
          teamId: p.teamId,
        })),
      },
      select: { name: true, teamId: true },
    });

    if (existing.length > 0) {
      const names = existing.map((e) => e.name).join(', ');
      throw new ConflictException(`These players already exist: ${names}`);
    }

    // 3️⃣ insert all (NO STATS HERE)
    await this.prisma.player.createMany({
      data: players.map((p) => ({
        name: p.name,
        role: p.role,
        battingStyle: p.battingStyle,
        bowlingStyle: p.bowlingStyle,
        teamId: p.teamId,
      })),
    });

    return this.prisma.player.findMany({
      where: {
        OR: players.map((p) => ({
          name: p.name,
          teamId: p.teamId,
        })),
      },
      include: { team: true },
    });
  }

  // ✅ List players (optionally by team)
  async findAll(teamId?: string) {
    return this.prisma.player.findMany({
      where: teamId ? { teamId } : undefined,
      include: { team: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const player = await this.prisma.player.findUnique({
      where: { id },
      include: { team: true },
    });

    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  // ✅ Update player (ONLY identity fields)
  async update(id: string, dto: UpdatePlayerDto) {
    try {
      return await this.prisma.player.update({
        where: { id },
        data: {
          name: dto.name,
          role: dto.role,
          battingStyle: dto.battingStyle,
          bowlingStyle: dto.bowlingStyle,
          teamId: dto.teamId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Player not found');
      }
      this.handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.player.delete({ where: { id } });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotFoundException('Player not found');
    }
  }
}
