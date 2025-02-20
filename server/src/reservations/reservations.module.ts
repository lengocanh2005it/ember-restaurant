import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasModule } from 'src/areas/areas.module';
import { Area } from 'src/areas/entities/areas.entity';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { OrderProductModule } from 'src/order-product/order-product.module';
import { Order } from 'src/orders/entities/orders.entity';
import { Payment } from 'src/payments/entities/payments.entity';
import { PaymentContext } from 'src/payments/payment.context';
import { PaymentStrategyFactory } from 'src/payments/payment.factory';
import { PaymentGateway } from 'src/payments/payment.gateway';
import { PaymentsService } from 'src/payments/payments.service';
import { ApplePayService } from 'src/payments/services/apple-pay.service';
import { CodService } from 'src/payments/services/cod.service';
import { PayPalService } from 'src/payments/services/paypal.service';
import { StripeService } from 'src/payments/services/stripe.service';
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
import { JwtService } from '@nestjs/jwt';
import { PromotionsService } from 'src/promotions/promotions.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/users.entity';
import { OrdersService } from 'src/orders/orders.service';
import { RolesModule } from 'src/roles/roles.module';
import { Role } from 'src/roles/entities/roles.entity';
import { Email } from 'src/emails/entities/emails.entity';
import { UploadsService } from 'src/uploads/uploads.service';
import { EmailsService } from 'src/emails/emails.service';

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
      User,
      Role,
      Email,
    ]),
    TablesModule,
    AreasModule,
    DiscountsModule,
    ProductsModule,
    OrderProductModule,
    UserDiscountModule,
    PromotionsModule,
    RolesModule,
  ],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    TablesService,
    PaymentsService,
    PromotionsService,
    PaymentContext,
    PaymentStrategyFactory,
    StripeService,
    PayPalService,
    CodService,
    ApplePayService,
    PaymentGateway,
    JwtService,
    AuthService,
    UsersService,
    OrdersService,
    EmailsService,
    UploadsService,
  ],
  exports: [ReservationsService],
})
export class ReservationsModule {}
