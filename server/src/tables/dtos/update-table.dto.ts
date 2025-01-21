import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateTableDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsOptional()
  readonly note?: string;

  @IsNumber()
  @IsPositive()
  readonly capacity!: number;

  @IsString()
  @IsNotEmpty()
  readonly status!: string;

  @IsNumber()
  @IsPositive()
  readonly price!: number;

  @IsBoolean()
  readonly is_reserved!: boolean;

  @IsString()
  @IsIn(['normal', 'vip'])
  @IsNotEmpty()
  readonly type!: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  readonly areaId: string;
}
