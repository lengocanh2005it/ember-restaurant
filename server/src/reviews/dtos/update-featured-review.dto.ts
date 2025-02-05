import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateFeaturedReviewsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly reviewIds!: string[];

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  readonly userId!: string;
}
