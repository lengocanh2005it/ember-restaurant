import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { CreateReviewDto } from 'src/reviews/dtos/create-review.dto';
import { UpdateFeaturedReviewsDto } from 'src/reviews/dtos/update-featured-review.dto';
import { Review } from 'src/reviews/entities/reviews.entity';
import { ReviewsService } from 'src/reviews/reviews.service';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getAllReviews(@Query('featured') featured: string): Promise<any> {
    return await this.reviewsService.handleCustomReviews(featured);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getReviewById(@Param('id') id: string) {
    return await this.reviewsService.getReviewById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async createReview(@Body() createReviewDto: CreateReviewDto): Promise<any> {
    return await this.reviewsService.createReview(createReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async deleteReview(
    @Param('id') id: string,
    @Query() queries: Record<string, string>,
  ): Promise<any> {
    return await this.reviewsService.deleteReview(id, queries);
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async handleUpdateReviews(
    @Body('reviews') reviews: Review[],
  ): Promise<Review[]> {
    return await this.reviewsService.handleUpdateReviews(reviews);
  }

  @Patch('featured')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async handleUpdateFeaturedReviews(
    @Body() updateFeaturedReviewsDto: UpdateFeaturedReviewsDto,
  ) {
    return await this.reviewsService.handleUpdateFeaturedReviews(
      updateFeaturedReviewsDto,
    );
  }
}
