import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasModule } from 'src/areas/areas.module';
import { Area } from 'src/areas/entities/areas.entity';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { OrderProductModule } from 'src/order-product/order-product.module';
import { Order } from 'src/orders/entities/orders.entity';
import { Payment } from 'src/payments/entities/payments.entity';
import { PaymentsService } from 'src/payments/payments.service';
import { Product } from 'src/products/entities/products.entity';
import { ProductsModule } from 'src/products/products.module';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { PromotionsModule } from 'src/promotions/promotions.module';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { Table } from 'src/tables/entities/tables.entity';
import { TablesModule } from 'src/tables/tables.module';
import { TablesService } from 'src/tables/tables.service';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { PaymentContext } from 'src/payments/payment.context';
import { PaymentStrategyFactory } from 'src/payments/payment.factory';
import { StripeService } from 'src/payments/services/stripe.service';
import { PayPalService } from 'src/payments/services/paypal.service';
import { CodService } from 'src/payments/services/cod.service';
import { ApplePayService } from 'src/payments/services/apple-pay.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      Table,
      Area,
      Payment,
      Order,
      Product,
      OrderProduct,
      UserDiscount,
      Promotion,
    ]),
    TablesModule,
    AreasModule,
    DiscountsModule,
    ProductsModule,
    OrderProductModule,
    UserDiscountModule,
    PromotionsModule,
  ],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    TablesService,
    PaymentsService,
    PaymentContext,
    PaymentStrategyFactory,
    StripeService,
    PayPalService,
    CodService,
    ApplePayService,
  ],
  exports: [ReservationsService],
})
export class ReservationsModule {}
