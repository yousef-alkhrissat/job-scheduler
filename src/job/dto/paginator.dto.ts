import { IsNumber } from 'class-validator';

export class PaginatorDto {
  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;
}
