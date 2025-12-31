export class CreateMatchResultDto {
  map(arg0: (dto: any) => { matchId: any; winnerTeamId: any; playerOfMatchId: any; resultType: any; summary: any; }): any {
    throw new Error('Method not implemented.');
  }
  matchId: string;

  winnerTeamId?: string;
  playerOfMatchId?: string;

  resultType: string; // WIN | DRAW | TIE | NO_RESULT
  summary?: string;
}
