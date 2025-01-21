import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { OrderProductModule } from 'src/order-product/order-product.module';
import { OrderProductService } from 'src/order-product/order-product.service';
import { Order } from 'src/orders/entities/orders.entity';
import { Payment } from 'src/payments/entities/payments.entity';
import { PaymentsService } from 'src/payments/payments.service';
import { StripeStrategy } from 'src/payments/strategies/stripe.strategy';
import { Product } from 'src/products/entities/products.entity';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { Role } from 'src/roles/entities/roles.entity';
import { RolesModule } from 'src/roles/roles.module';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { DiscountsService } from 'src/discounts/discounts.service';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { PromotionsService } from 'src/promotions/promotions.service';
import { PromotionsModule } from 'src/promotions/promotions.module';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { TablesModule } from 'src/tables/tables.module';
import { Table } from 'src/tables/entities/tables.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderProduct,
      Product,
      Payment,
      User,
      Role,
      Discount,
      UserDiscount,
      Reservation,
      Discount,
      Promotion,
      Table,
    ]),
    OrderProductModule,
    ProductsModule,
    RolesModule,
    DiscountsModule,
    UserDiscountModule,
    ReservationsModule,
    DiscountsModule,
    PromotionsModule,
    TablesModule,
  ],
  providers: [
    OrdersService,
    OrderProductService,
    ProductsService,
    PaymentsService,
    StripeStrategy,
    DiscountsService,
    UsersService,
    UserDiscountService,
    PromotionsService,
  ],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
