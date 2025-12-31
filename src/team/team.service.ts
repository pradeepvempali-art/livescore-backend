// src/team/team.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { BulkCreateTeamDto } from './dto/bulk-create-team.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  private handlePrismaError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // unique constraint
        throw new ConflictException('Team with this name already exists');
      }
    }
    throw error;
  }

  async create(dto: CreateTeamDto) {
    try {
      return await this.prisma.team.create({
        data: {
          name: dto.name,
          shortName: dto.shortName,
          coach: dto.coach,
          captain: dto.captain,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async bulkCreate(dto: BulkCreateTeamDto) {
    const items = dto.teams;

    // 1) check duplicates in same request
    const names = items.map((t) => t.name.trim());
    const uniqueNames = new Set(names);
    if (uniqueNames.size !== names.length) {
      throw new BadRequestException('Duplicate team names in request body');
    }

    // 2) check already existing in DB
    const existing = await this.prisma.team.findMany({
      where: { name: { in: names } },
      select: { name: true },
    });

    if (existing.length > 0) {
      const existingNames = existing.map((e) => e.name).join(', ');
      throw new ConflictException(
        `These team names already exist: ${existingNames}`,
      );
    }

    // 3) insert all
    await this.prisma.team.createMany({
      data: items.map((t) => ({
        name: t.name.trim(),
        shortName: t.shortName,
        coach: t.coach,
        captain: t.captain,
      })),
    });

    // return inserted teams
    return this.prisma.team.findMany({
      where: { name: { in: names } },
    });
  }

  async findAll() {
    return this.prisma.team.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        players: true,
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async update(id: string, dto: UpdateTeamDto) {
    try {
      return await this.prisma.team.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Team not found');
        }
      }
      this.handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.team.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Team not found');
        }
      }
      throw error;
    }
  }
}
