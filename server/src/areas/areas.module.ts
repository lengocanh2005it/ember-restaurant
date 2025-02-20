import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from 'src/areas/entities/areas.entity';
import { AuthService } from 'src/auth/auth.service';
import { DiscountContext } from 'src/discounts/discount.context';
import { DiscountStrategyFactory } from 'src/discounts/discount.factory';
import { DiscountsService } from 'src/discounts/discounts.service';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { EmailsService } from 'src/emails/emails.service';
import { Email } from 'src/emails/entities/emails.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { OrderProductModule } from 'src/order-product/order-product.module';
import { Order } from 'src/orders/entities/orders.entity';
import { OrdersService } from 'src/orders/orders.service';
import { Payment } from 'src/payments/entities/payments.entity';
import { PaymentContext } from 'src/payments/payment.context';
import { PaymentStrategyFactory } from 'src/payments/payment.factory';
import { PaymentGateway } from 'src/payments/payment.gateway';
import { PaymentsService } from 'src/payments/payments.service';
import { ApplePayService } from 'src/payments/services/apple-pay.service';
import { CodService } from 'src/payments/services/cod.service';
import { PayPalService } from 'src/payments/services/paypal.service';
import { StripeService } from 'src/payments/services/stripe.service';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { Product } from 'src/products/entities/products.entity';
import { ProductsService } from 'src/products/products.service';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { PromotionsService } from 'src/promotions/promotions.service';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { ReservationsService } from 'src/reservations/reservations.service';
import { Role } from 'src/roles/entities/roles.entity';
import { RolesService } from 'src/roles/roles.service';
import { TablesService } from 'src/tables/tables.service';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { Table } from 'typeorm';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { UploadsService } from 'src/uploads/uploads.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Area,
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
      Table,
      Permission,
      Email,
    ]),
    UserDiscountModule,
    OrderProductModule,
    PermissionsModule,
  ],
  controllers: [AreasController],
  providers: [
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
    TablesService,
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
  exports: [AreasService],
})
export class AreasModule {}
