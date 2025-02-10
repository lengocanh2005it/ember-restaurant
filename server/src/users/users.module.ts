import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { DiscountsService } from 'src/discounts/discounts.service';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { OrderProductModule } from 'src/order-product/order-product.module';
import { Order } from 'src/orders/entities/orders.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { OrdersService } from 'src/orders/orders.service';
import { Payment } from 'src/payments/entities/payments.entity';
import { PaymentsModule } from 'src/payments/payments.module';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { Product } from 'src/products/entities/products.entity';
import { ProductsModule } from 'src/products/products.module';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { PromotionsModule } from 'src/promotions/promotions.module';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { ReservationsService } from 'src/reservations/reservations.service';
import { Role } from 'src/roles/entities/roles.entity';
import { RolesModule } from 'src/roles/roles.module';
import { RolesService } from 'src/roles/roles.service';
import { Table } from 'src/tables/entities/tables.entity';
import { TablesModule } from 'src/tables/tables.module';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { User } from 'src/users/entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      Discount,
      Reservation,
      UserDiscount,
      Order,
      Product,
      Payment,
      Promotion,
      Table,
    ]),
    OrdersModule,
    RolesModule,
    PermissionsModule,
    DiscountsModule,
    ReservationsModule,
    UserDiscountModule,
    OrderProductModule,
    ProductsModule,
    PaymentsModule,
    PromotionsModule,
    TablesModule,
  ],
  providers: [
    RolesService,
    UsersService,
    DiscountsService,
    UserDiscountService,
    ReservationsService,
    OrdersService,
    AuthService,
    JwtService,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
