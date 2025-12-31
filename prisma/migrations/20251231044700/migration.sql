/*
  Warnings:

  - You are about to drop the column `economy` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `matchesPlayed` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `runs` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `strikeRate` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `wickets` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "economy",
DROP COLUMN "matchesPlayed",
DROP COLUMN "runs",
DROP COLUMN "strikeRate",
DROP COLUMN "wickets";

-- CreateTable
CREATE TABLE "PlayerStats" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "inningsId" TEXT,
    "runs" INTEGER NOT NULL DEFAULT 0,
    "ballsFaced" INTEGER NOT NULL DEFAULT 0,
    "fours" INTEGER NOT NULL DEFAULT 0,
    "sixes" INTEGER NOT NULL DEFAULT 0,
    "overs" DOUBLE PRECISION,
    "runsConceded" INTEGER,
    "wickets" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStats_playerId_matchId_key" ON "PlayerStats"("playerId", "matchId");

-- AddForeignKey
ALTER TABLE "PlayerStats" ADD CONSTRAINT "PlayerStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerStats" ADD CONSTRAINT "PlayerStats_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerStats" ADD CONSTRAINT "PlayerStats_inningsId_fkey" FOREIGN KEY ("inningsId") REFERENCES "Innings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
