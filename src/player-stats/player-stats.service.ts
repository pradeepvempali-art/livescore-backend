import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BulkCreatePlayerStatsDto } from './dto/bulk-create-player-stats.dto';
import { PlayerStats } from '@prisma/client';

@Injectable()
export class PlayerStatsService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔥 BULK UPSERT (ONLY ENTRY POINT)
  async bulkUpsert(dto: BulkCreatePlayerStatsDto) {
    const results: PlayerStats[] = [];

    // 1️⃣ Validate match
    const match = await this.prisma.match.findUnique({
      where: { id: dto.matchId },
    });
    if (!match) {
      throw new BadRequestException('Invalid matchId');
    }

    // 2️⃣ Validate players
    const playerIds = [...new Set(dto.stats.map((s) => s.playerId))];
    const players = await this.prisma.player.findMany({
      where: { id: { in: playerIds } },
      select: { id: true },
    });

    if (players.length !== playerIds.length) {
      throw new BadRequestException('One or more playerIds are invalid');
    }

    // 3️⃣ Validate innings (if provided)
    const inningsIds = [
      ...new Set(dto.stats.map((s) => s.inningsId).filter(Boolean)),
    ] as string[];

    if (inningsIds.length > 0) {
      const innings = await this.prisma.innings.findMany({
        where: { id: { in: inningsIds } },
        select: { id: true },
      });

      if (innings.length !== inningsIds.length) {
        throw new BadRequestException('One or more inningsIds are invalid');
      }
    }

    // 4️⃣ UPSERT stats
    for (const stat of dto.stats) {
      const result = await this.prisma.playerStats.upsert({
        where: {
          playerId_matchId: {
            playerId: stat.playerId,
            matchId: dto.matchId,
          },
        },
        update: {
          runs: stat.runs,
          ballsFaced: stat.ballsFaced,
          fours: stat.fours,
          sixes: stat.sixes,
          wickets: stat.wickets,
          overs: stat.overs,
          runsConceded: stat.runsConceded,
          inningsId: stat.inningsId,
        },
        create: {
          playerId: stat.playerId,
          matchId: dto.matchId,
          inningsId: stat.inningsId,
          runs: stat.runs ?? 0,
          ballsFaced: stat.ballsFaced ?? 0,
          fours: stat.fours ?? 0,
          sixes: stat.sixes ?? 0,
          wickets: stat.wickets ?? 0,
          overs: stat.overs,
          runsConceded: stat.runsConceded,
        },
      });

      results.push(result);
    }

    return {
      count: results.length,
      data: results,
    };
  }

  // ✅ GET ALL
  findAll() {
    return this.prisma.playerStats.findMany({
      include: {
        player: true,
        match: true,
        innings: true,
      },
    });
  }

  // ✅ GET BY MATCH
  findByMatch(matchId: string) {
    return this.prisma.playerStats.findMany({
      where: { matchId },
      include: { player: true },
    });
  }

  // ✅ GET BY PLAYER
  findByPlayer(playerId: string) {
    return this.prisma.playerStats.findMany({
      where: { playerId },
      include: { match: true },
    });
  }

  // ✅ UPDATE
  async update(id: string, data: Partial<PlayerStats>) {
    try {
      return await this.prisma.playerStats.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException('PlayerStats not found');
    }
  }

  // ✅ DELETE
  async remove(id: string) {
    try {
      return await this.prisma.playerStats.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException('PlayerStats not found');
    }
  }
}
