import { PartialType } from '@nestjs/mapped-types';
import { CreateInningDto } from './create-inning.dto';

export class UpdateInningDto extends PartialType(CreateInningDto) {}
