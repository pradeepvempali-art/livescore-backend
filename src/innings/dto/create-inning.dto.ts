export class CreateInningDto {
  matchId: string;
  teamId: string;
  inningsNumber: number; // 1 or 2
  runs: number;
  wickets: number;
  overs: number;
}
