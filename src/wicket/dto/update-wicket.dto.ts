import { PartialType } from '@nestjs/mapped-types';
import { CreateWicketDto } from './create-wicket.dto';

export class UpdateWicketDto extends PartialType(CreateWicketDto) {}
