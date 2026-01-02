import { IsString, IsUUID } from 'class-validator';

export class CreateMatchDto {
  @IsString()
  title: string;

  @IsString()
  venue: string;

  @IsString()
  tournament: string;

  @IsUUID()
  teamAId: string;

  @IsUUID()
  teamBId: string;
}
