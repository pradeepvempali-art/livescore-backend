import { IsInt, IsUUID, Min, Max } from 'class-validator';

export class CreateInningDto {
  @IsUUID()
  matchId: string;

  @IsUUID()
  teamId: string; // batting team

  @IsInt()
  @Min(1)
  @Max(2)
  inningsNumber: number;
}
