import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasModule } from 'src/areas/areas.module';
import { Area } from 'src/areas/entities/areas.entity';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { DiscountsService } from 'src/discounts/discounts.service';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { OrderProductModule } from 'src/order-product/order-product.module';
import { OrderProductService } from 'src/order-product/order-product.service';
import { Order } from 'src/orders/entities/orders.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { Payment } from 'src/payments/entities/payments.entity';
import { PaymentContext } from 'src/payments/payment.context';
import { PaymentStrategyFactory } from 'src/payments/payment.factory';
import { PaymentGateway } from 'src/payments/payment.gateway';
import { ApplePayService } from 'src/payments/services/apple-pay.service';
import { CodService } from 'src/payments/services/cod.service';
import { PayPalService } from 'src/payments/services/paypal.service';
import { StripeService } from 'src/payments/services/stripe.service';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { Product } from 'src/products/entities/products.entity';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { PromotionsModule } from 'src/promotions/promotions.module';
import { PromotionsService } from 'src/promotions/promotions.service';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { RolesModule } from 'src/roles/roles.module';
import { Table } from 'src/tables/entities/tables.entity';
import { TablesModule } from 'src/tables/tables.module';
import { TablesService } from 'src/tables/tables.service';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      User,
      Order,
      Product,
      Reservation,
      OrderProduct,
      Discount,
      UserDiscount,
      Promotion,
      Table,
      Area,
    ]),
    RolesModule,
    PermissionsModule,
    DiscountsModule,
    UserDiscountModule,
    ReservationsModule,
    OrderProductModule,
    OrdersModule,
    ProductsModule,
    ReservationsModule,
    OrderProductModule,
    PromotionsModule,
    TablesModule,
    AreasModule,
  ],
  providers: [
    PaymentsService,
    UsersService,
    ProductsService,
    OrderProductService,
    DiscountsService,
    UserDiscountService,
    PromotionsService,
    TablesService,
    PaymentContext,
    PaymentStrategyFactory,
    ApplePayService,
    CodService,
    StripeService,
    PayPalService,
    PaymentGateway,
    JwtService,
    AuthService,
  ],
  controllers: [PaymentsController],
  exports: [
    PaymentsService,
    PaymentContext,
    PaymentStrategyFactory,
    ApplePayService,
    CodService,
    PayPalService,
    StripeService,
  ],
})
export class PaymentsModule {}
