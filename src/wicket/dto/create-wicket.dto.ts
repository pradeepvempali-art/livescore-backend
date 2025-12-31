export class CreateWicketDto {
  matchId: string;
  inningsId: string;

  batsmanId: string;
  bowlerId: string;

  over: number;
  ball: number;
  kind: string; // BOWLED | CAUGHT | RUN_OUT | LBW
}
