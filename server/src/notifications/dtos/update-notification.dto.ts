import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateNotificationDto {
  @IsString()
  @IsNotEmpty()
  readonly title!: string;

  @IsString()
  @IsNotEmpty()
  readonly content!: string;

  @IsOptional()
  readonly image!: string;
}
