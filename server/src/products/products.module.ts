import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { OrderProductModule } from 'src/order-product/order-product.module';
import { Order } from 'src/orders/entities/orders.entity';
import { OrdersService } from 'src/orders/orders.service';
import { Payment } from 'src/payments/entities/payments.entity';
import { PaymentsService } from 'src/payments/payments.service';
import { Product } from 'src/products/entities/products.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { ReservationsService } from 'src/reservations/reservations.service';
import { Role } from 'src/roles/entities/roles.entity';
import { RolesModule } from 'src/roles/roles.module';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PromotionsService } from 'src/promotions/promotions.service';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { Table } from 'src/tables/entities/tables.entity';
import { TablesService } from 'src/tables/tables.service';
import { PaymentContext } from 'src/payments/payment.context';
import { StripeService } from 'src/payments/services/stripe.service';
import { PaymentGateway } from 'src/payments/payment.gateway';
import { AreasService } from 'src/areas/areas.service';
import { Area } from 'src/areas/entities/areas.entity';
import { PaymentStrategyFactory } from 'src/payments/payment.factory';
import { PayPalService } from 'src/payments/services/paypal.service';
import { ApplePayService } from 'src/payments/services/apple-pay.service';
import { CodService } from 'src/payments/services/cod.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      User,
      Order,
      Role,
      Discount,
      UserDiscount,
      Reservation,
      OrderProduct,
      Payment,
      Promotion,
      Table,
      Area,
    ]),
    RolesModule,
    DiscountsModule,
    UserDiscountModule,
    OrderProductModule,
  ],
  providers: [
    ProductsService,
    AuthService,
    UsersService,
    JwtService,
    OrdersService,
    ReservationsService,
    PaymentsService,
    PromotionsService,
    TablesService,
    PaymentContext,
    StripeService,
    PaymentGateway,
    AreasService,
    PaymentStrategyFactory,
    PayPalService,
    ApplePayService,
    CodService,
  ],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
