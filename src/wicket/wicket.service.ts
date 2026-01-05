import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateWicketDto } from './dto/create-wicket.dto';
import { UpdateWicketDto } from './dto/update-wicket.dto';

@Injectable()
export class WicketService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ SINGLE CREATE
  async create(dto: CreateWicketDto) {
    // 1️⃣ Create wicket entry
    const wicket = await this.prisma.wicket.create({
      data: dto,
    });

    // 2️⃣ Update bowler stats (PER MATCH)
    await this.prisma.playerStats.upsert({
      where: {
        playerId_matchId: {
          playerId: dto.bowlerId,
          matchId: dto.matchId,
        },
      },
      update: {
        wickets: { increment: 1 },
      },
      create: {
        playerId: dto.bowlerId,
        matchId: dto.matchId,
        inningsId: dto.inningsId,
        wickets: 1,
      },
    });

    return wicket;
  }

  // ✅ BULK CREATE
  async bulkCreate(dtos: CreateWicketDto[]) {
    // 1️⃣ Create all wickets
    const result = await this.prisma.wicket.createMany({
      data: dtos,
    });

    // 2️⃣ Update bowler stats per match
    for (const dto of dtos) {
      await this.prisma.playerStats.upsert({
        where: {
          playerId_matchId: {
            playerId: dto.bowlerId,
            matchId: dto.matchId,
          },
        },
        update: {
          wickets: { increment: 1 },
        },
        create: {
          playerId: dto.bowlerId,
          matchId: dto.matchId,
          inningsId: dto.inningsId,
          wickets: 1,
        },
      });
    }

    return result;
  }

  // ✅ FIND ALL
  findAll() {
    return this.prisma.wicket.findMany({
      include: {
        batsman: true,
        bowler: true,
        match: true,
      },
    });
  }

  // ✅ FIND ONE
  findOne(id: string) {
    return this.prisma.wicket.findUnique({
      where: { id },
      include: {
        batsman: true,
        bowler: true,
      },
    });
  }

  // ✅ UPDATE (no stat side-effects)
  update(id: string, dto: UpdateWicketDto) {
    return this.prisma.wicket.update({
      where: { id },
      data: dto,
    });
  }

  // ✅ DELETE (optional: reverse stats later)
  remove(id: string) {
    return this.prisma.wicket.delete({
      where: { id },
    });
  }
}
