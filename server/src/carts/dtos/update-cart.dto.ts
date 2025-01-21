import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateCartDto {
  @IsNumber()
  @IsPositive()
  readonly quantity!: number;

  @IsOptional()
  readonly note?: string;
}
