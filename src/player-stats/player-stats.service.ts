import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlayerStatsDto } from './dto/create-player-stat.dto';
import { UpdatePlayerStatsDto } from './dto/update-player-stat.dto';
import { BulkCreatePlayerStatsDto } from './dto/bulk-create-player-stats.dto';
import { PlayerStats } from '@prisma/client';

@Injectable()
export class PlayerStatsService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔥 BULK UPSERT (MAIN METHOD)
  async bulkUpsert(dto: BulkCreatePlayerStatsDto) {
    const results: PlayerStats[] = [];

    for (const stat of dto.stats) {
      const result = await this.prisma.playerStats.upsert({
        where: {
          playerId_matchId: {
            playerId: stat.playerId,
            matchId: stat.matchId,
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
          matchId: stat.matchId,
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

  // ✅ CREATE SINGLE PLAYER STATS (OPTIONAL)
  create(dto: CreatePlayerStatsDto) {
    return this.prisma.playerStats.create({
      data: dto,
    });
  }

  // ✅ GET ALL PLAYER STATS
  findAll() {
    return this.prisma.playerStats.findMany({
      include: {
        player: true,
        match: true,
        innings: true,
      },
    });
  }

  // ✅ GET STATS BY MATCH
  findByMatch(matchId: string) {
    return this.prisma.playerStats.findMany({
      where: { matchId },
      include: { player: true },
    });
  }

  // ✅ GET STATS BY PLAYER
  findByPlayer(playerId: string) {
    return this.prisma.playerStats.findMany({
      where: { playerId },
      include: { match: true },
    });
  }

  // ✅ UPDATE SINGLE STAT ROW
  async update(id: string, dto: UpdatePlayerStatsDto) {
    try {
      return await this.prisma.playerStats.update({
        where: { id },
        data: dto,
      });
    } catch {
      throw new NotFoundException('PlayerStats not found');
    }
  }

  // ✅ DELETE SINGLE STAT ROW
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
