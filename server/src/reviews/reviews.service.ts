import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/orders.entity';
import { OrdersService } from 'src/orders/orders.service';
import { Product } from 'src/products/entities/products.entity';
import { ProductsService } from 'src/products/products.service';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { ReservationsService } from 'src/reservations/reservations.service';
import { CreateReviewDto } from 'src/reviews/dtos/create-review.dto';
import { UpdateFeaturedReviewsDto } from 'src/reviews/dtos/update-featured-review.dto';
import { Review } from 'src/reviews/entities/reviews.entity';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly productsService: ProductsService,
    private readonly dataSource: DataSource,
    private readonly ordersService: OrdersService,
    private readonly reservationsService: ReservationsService,
    private readonly usersService: UsersService,
  ) {}

  // ngoc
  private async getAllReviews(featured?: string): Promise<Review[]> {
    let reviews = await this.reviewRepository.find({
      relations: ['user'],
    });

    if (featured && featured === 'true') {
      reviews = await this.reviewRepository.find({
        where: {
          is_featured: true,
        },
        relations: ['user'],
      });

      return reviews.map((review) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...res } = review.user;

        return {
          ...review,
          user: res,
        };
      });
    }

    return reviews.map((review) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...res } = review.user;

      return {
        ...review,
        user: res,
      };
    });
  }

  public async getReviewById(id: string) {
    const review = await this.reviewRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });

    if (!review) throw new NotFoundException('Review Not Found.');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...res } = review.user;

    return {
      ...review,
      user: res,
    };
  }

  public async createReview(createReviewDto: CreateReviewDto): Promise<any> {
    const { productId, userId, rating_number, type, orderIds, reservationIds } =
      createReviewDto;

    const review = this.reviewRepository.create(createReviewDto);

    const user = await this.dataSource.getRepository(User).findOne({
      where: { id: userId },
      select: ['id'],
    });

    if (!user) throw new NotFoundException('User Not Found.');

    if (type === 'product' || type === 'restaurant') {
      await this.reviewRepository.save(review);

      await this.reviewRepository
        .createQueryBuilder('reviews')
        .relation(Review, 'user')
        .of(review.id)
        .set(user.id);

      if (type === 'restaurant') return review;
    }

    if (productId && rating_number > 0 && type === 'product') {
      const product = await this.productsService.findOne(productId);

      await this.productsService.updateAverageRatingNumber(
        productId,
        rating_number,
      );

      await this.reviewRepository
        .createQueryBuilder('reviews')
        .relation(Review, 'product')
        .of(review.id)
        .set(product.id);

      return {
        reviews: await this.getAllReviews('false'),
        products: await this.productsService.findAll(),
      };
    }

    await this.reviewRepository.save(review);

    if (orderIds && orderIds.length && type === 'order') {
      const orders = await this.ordersService.transformOrderIds(orderIds);

      for (const order of orders) {
        await this.dataSource
          .createQueryBuilder()
          .relation(Order, 'reviews')
          .of(order.id)
          .add(review.id);
      }
    }

    if (reservationIds && reservationIds.length && type === 'reservation') {
      const reservations =
        await this.reservationsService.transformReservationIds(reservationIds);

      for (const reservation of reservations) {
        await this.dataSource
          .createQueryBuilder()
          .relation(Reservation, 'reviews')
          .of(reservation.id)
          .add(review.id);
      }
    }

    if (
      (reservationIds.length && type === 'reservation') ||
      (orderIds.length && type === 'order')
    ) {
      await this.reviewRepository
        .createQueryBuilder('reviews')
        .relation(Review, 'user')
        .of(review.id)
        .set(user.id);
    }

    return review;
  }

  public async deleteReview(
    id: string,
    queries?: Record<string, string>,
  ): Promise<any> {
    const review = await this.reviewRepository.findOneBy({ id });

    if (!review) throw new NotFoundException('Review Not Found.');

    await this.reviewRepository.delete({ id });

    if (queries && queries.userId) {
      return await this.usersService.handleFindReviewOfUser(queries.userId);
    }
  }

  public async handleCustomReviews(featured?: string): Promise<Review[]> {
    return await this.getAllReviews(featured);
  }

  public async handleUpdateReviews(reviews: Review[]): Promise<Review[]> {
    if (!reviews.length) throw new BadRequestException('Empty reviews.');

    for (const item of reviews) {
      const review = await this.reviewRepository.findOneBy({ id: item.id });
      if (!review) throw new NotFoundException('Review Not Found.');

      await this.reviewRepository.update(
        { id: item.id },
        {
          is_featured: true,
        },
      );
    }

    return this.getAllReviews();
  }

  public async findProduct(product: Product): Promise<any> {
    const products = await this.reviewRepository.findBy({ product });

    if (!products.length) return;

    return {
      totalCount: products.length,
      totalRatingNumbers: products.reduce((acc, curr) => {
        return acc + curr.rating_number;
      }, 0),
    };
  }

  public handleUpdateFeaturedReviews = async (
    updateFeaturedReviews: UpdateFeaturedReviewsDto,
  ): Promise<any> => {
    const { userId, reviewIds } = updateFeaturedReviews;

    const reviews = await this.reviewRepository.find();

    for (const reviewId of reviews.map((r) => r.id)) {
      await this.reviewRepository.update(
        { id: reviewId },
        { is_featured: reviewIds.some((r) => r === reviewId) },
      );
    }

    return {
      reviews_user: await this.usersService.handleFindReviewOfUser(userId),
      reviews: await this.getAllReviews('true'),
    };
  };
}
