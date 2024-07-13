import { IsString, IsDate, IsOptional, IsJSON, IsEnum } from 'class-validator';
import IntervalEnum from '../enums/interval.enum';

export class CreateJobDto {
  @IsEnum(IntervalEnum)
  name: IntervalEnum;

  @IsDate()
  @IsOptional()
  lastRun?: Date;

  @IsDate()
  @IsOptional()
  nextRun?: Date;

  @IsString()
  interval: string;

  @IsOptional()
  @IsJSON()
  options?: any;
}
