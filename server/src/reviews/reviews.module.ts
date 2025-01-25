import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { DiscountsService } from 'src/discounts/discounts.service';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { OrderProductModule } from 'src/order-product/order-product.module';
import { OrderProductService } from 'src/order-product/order-product.service';
import { Order } from 'src/orders/entities/orders.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { OrdersService } from 'src/orders/orders.service';
import { Payment } from 'src/payments/entities/payments.entity';
import { PaymentsModule } from 'src/payments/payments.module';
import { PaymentsService } from 'src/payments/payments.service';
import { Product } from 'src/products/entities/products.entity';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { PromotionsModule } from 'src/promotions/promotions.module';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { ReservationsService } from 'src/reservations/reservations.service';
import { Review } from 'src/reviews/entities/reviews.entity';
import { ReviewsController } from 'src/reviews/reviews.controller';
import { ReviewsService } from 'src/reviews/reviews.service';
import { Role } from 'src/roles/entities/roles.entity';
import { RolesModule } from 'src/roles/roles.module';
import { Table } from 'src/tables/entities/tables.entity';
import { TablesModule } from 'src/tables/tables.module';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { User } from 'src/users/entities/users.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review,
      Product,
      Order,
      OrderProduct,
      Payment,
      Discount,
      UserDiscount,
      Reservation,
      Promotion,
      Table,
      User,
      Role,
    ]),
    ProductsModule,
    OrdersModule,
    OrderProductModule,
    PaymentsModule,
    DiscountsModule,
    UserDiscountModule,
    ReservationsModule,
    PromotionsModule,
    TablesModule,
    UsersModule,
    RolesModule,
  ],
  providers: [
    ReviewsService,
    ProductsService,
    OrdersService,
    OrderProductService,
    PaymentsService,
    DiscountsService,
    UserDiscount,
    ReservationsService,
    UsersService,
  ],
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}
