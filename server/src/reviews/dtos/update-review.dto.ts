import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateReviewDto } from 'src/reviews/dtos/create-review.dto';

export class UpdateReviewDto extends CreateReviewDto {
  @IsBoolean()
  @IsNotEmpty()
  readonly is_featured!: boolean;
}
