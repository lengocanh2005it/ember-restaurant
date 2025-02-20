import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from 'src/tables/entities/tables.entity';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { AreasModule } from 'src/areas/areas.module';
import { AreasService } from 'src/areas/areas.service';
import { Area } from 'src/areas/entities/areas.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { DiscountContext } from 'src/discounts/discount.context';
import { DiscountStrategyFactory } from 'src/discounts/discount.factory';
import { DiscountsService } from 'src/discounts/discounts.service';
import { EventsService } from 'src/events/events.service';
import { OrdersService } from 'src/orders/orders.service';
import { PaymentContext } from 'src/payments/payment.context';
import { PaymentStrategyFactory } from 'src/payments/payment.factory';
import { PaymentGateway } from 'src/payments/payment.gateway';
import { PaymentsService } from 'src/payments/payments.service';
import { ApplePayService } from 'src/payments/services/apple-pay.service';
import { CodService } from 'src/payments/services/cod.service';
import { PayPalService } from 'src/payments/services/paypal.service';
import { StripeService } from 'src/payments/services/stripe.service';
import { ProductsService } from 'src/products/products.service';
import { PromotionsService } from 'src/promotions/promotions.service';
import { ReservationsService } from 'src/reservations/reservations.service';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { Role } from 'src/roles/entities/roles.entity';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { Payment } from 'src/payments/entities/payments.entity';
import { Product } from 'src/products/entities/products.entity';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { User } from 'src/users/entities/users.entity';
import { OrderProductModule } from 'src/order-product/order-product.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { Event } from 'src/events/entities/events.entity';
import { Email } from 'src/emails/entities/emails.entity';
import { EmailsService } from 'src/emails/emails.service';
import { UploadsService } from 'src/uploads/uploads.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Table,
      Area,
      Event,
      Discount,
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
      Permission,
      Email,
    ]),
    AreasModule,
    UserDiscountModule,
    OrderProductModule,
    PermissionsModule,
  ],
  providers: [
    TablesService,
    AreasService,
    EventsService,
    AreasService,
    DiscountsService,
    DiscountContext,
    DiscountStrategyFactory,
    AuthService,
    UsersService,
    JwtService,
    OrdersService,
    ReservationsService,
    PaymentsService,
    PromotionsService,
    PaymentContext,
    StripeService,
    PaymentGateway,
    AreasService,
    PaymentStrategyFactory,
    PayPalService,
    ApplePayService,
    CodService,
    RolesService,
    ProductsService,
    EmailsService,
    UploadsService,
  ],
  controllers: [TablesController],
  exports: [TablesService],
})
export class TablesModule {}
