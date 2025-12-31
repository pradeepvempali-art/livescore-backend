import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ CREATE SINGLE
  async create(dto: CreateScheduleDto) {
    const match = await this.prisma.match.findUnique({
      where: { id: dto.matchId },
    });

    if (!match) {
      throw new BadRequestException('Invalid matchId');
    }

    const existing = await this.prisma.schedule.findUnique({
      where: { matchId: dto.matchId },
    });

    if (existing) {
      throw new BadRequestException('Schedule already exists for this match');
    }

    return this.prisma.schedule.create({
      data: {
        matchId: dto.matchId,
        date: new Date(dto.date),
      },
    });
  }

  // ✅ CREATE BULK (FIXED)
  async createBulk(schedules: CreateScheduleDto[]) {
    const matchIds = schedules.map((s) => s.matchId);

    // Validate matches
    const matches = await this.prisma.match.findMany({
      where: { id: { in: matchIds } },
      select: { id: true },
    });

    if (matches.length !== matchIds.length) {
      throw new BadRequestException('One or more matchIds are invalid');
    }

    // Check existing schedules
    const existing = await this.prisma.schedule.findMany({
      where: { matchId: { in: matchIds } },
      select: { matchId: true },
    });

    if (existing.length > 0) {
      throw new BadRequestException(
        `Schedule already exists for matchId(s): ${existing
          .map((e) => e.matchId)
          .join(', ')}`,
      );
    }

    // Create all
    return this.prisma.schedule.createMany({
      data: schedules.map((s) => ({
        matchId: s.matchId,
        date: new Date(s.date),
      })),
    });
  }

  // READ ALL
  async findAll() {
    return this.prisma.schedule.findMany({
      include: {
        match: {
          include: {
            teamA: true,
            teamB: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  // READ ONE
  async findOne(id: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: { match: true },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    return schedule;
  }

  // UPDATE
  async update(id: string, dto: UpdateScheduleDto) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    if (dto.matchId && dto.matchId !== schedule.matchId) {
      const existing = await this.prisma.schedule.findUnique({
        where: { matchId: dto.matchId },
      });

      if (existing) {
        throw new BadRequestException('Schedule already exists for this match');
      }
    }

    return this.prisma.schedule.update({
      where: { id },
      data: {
        matchId: dto.matchId,
        date: dto.date ? new Date(dto.date) : undefined,
      },
    });
  }

  // DELETE
  async remove(id: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    await this.prisma.schedule.delete({ where: { id } });

    return { message: 'Schedule deleted successfully' };
  }
}
