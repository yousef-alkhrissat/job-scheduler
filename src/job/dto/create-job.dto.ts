import { IsString, IsDate, IsOptional, IsJSON } from 'class-validator';

export class CreateJobDto {
  @IsString()
  name: string;

  @IsDate()
  lastRun: Date;

  @IsDate()
  nextRun: Date;

  @IsString()
  interval: string;

  @IsOptional()
  @IsJSON()
  options?: any;
}
