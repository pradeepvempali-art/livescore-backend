import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInningDto } from './dto/create-inning.dto';
import { UpdateInningDto } from './dto/update-inning.dto';

@Injectable()
export class InningsService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ CREATE SINGLE
  create(dto: CreateInningDto) {
    return this.prisma.innings.create({
      data: dto,
    });
  }

  // ✅ BULK CREATE
  bulkCreate(dtos: CreateInningDto[]) {
    return this.prisma.innings.createMany({
      data: dtos,
      skipDuplicates: true,
    });
  }

  // ✅ GET ALL (ADMIN / DEBUG)
  findAll() {
    return this.prisma.innings.findMany({
      include: {
        team: true,
        match: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // 🔥 GET INNINGS BY MATCH (THIS FIXES YOUR UI ISSUE)
  findByMatch(matchId: string) {
    return this.prisma.innings.findMany({
      where: { matchId },
      include: {
        team: true,
      },
      orderBy: {
        inningsNumber: 'asc',
      },
    });
  }

  // ✅ GET ONE
  findOne(id: string) {
    return this.prisma.innings.findUnique({
      where: { id },
      include: {
        team: true,
        match: true,
      },
    });
  }

  // ✅ UPDATE
  update(id: string, dto: UpdateInningDto) {
    return this.prisma.innings.update({
      where: { id },
      data: dto,
    });
  }

  // ✅ DELETE
  remove(id: string) {
    return this.prisma.innings.delete({
      where: { id },
    });
  }
}
