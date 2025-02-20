import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { OrdersModule } from 'src/orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/carts/entities/carts.entity';
import { User } from 'src/users/entities/users.entity';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { ReservationsService } from 'src/reservations/reservations.service';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/entities/products.entity';
import { TablesModule } from 'src/tables/tables.module';
import { Table } from 'src/tables/entities/tables.entity';
import { PaymentsModule } from 'src/payments/payments.module';
import { Payment } from 'src/payments/entities/payments.entity';
import { PromotionsModule } from 'src/promotions/promotions.module';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Email } from 'src/emails/entities/emails.entity';
import { EmailsService } from 'src/emails/emails.service';
import { UploadsService } from 'src/uploads/uploads.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      User,
      UserDiscount,
      Reservation,
      Product,
      Table,
      Payment,
      Promotion,
      Email,
    ]),
    ProductsModule,
    UsersModule,
    CartsModule,
    RolesModule,
    PermissionsModule,
    DiscountsModule,
    OrdersModule,
    UserDiscountModule,
    ReservationsModule,
    TablesModule,
    PaymentsModule,
    PromotionsModule,
  ],
  providers: [
    CartsService,
    UsersService,
    UserDiscountService,
    ReservationsService,
    ProductsService,
    AuthService,
    JwtService,
    EmailsService,
    UploadsService,
  ],
  controllers: [CartsController],
  exports: [CartsService],
})
export class CartsModule {}
