import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasModule } from 'src/areas/areas.module';
import { Area } from 'src/areas/entities/areas.entity';
import { AuthService } from 'src/auth/auth.service';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { OrderProductService } from 'src/order-product/order-product.service';
import { Order } from 'src/orders/entities/orders.entity';
import { OrdersService } from 'src/orders/orders.service';
import { Payment } from 'src/payments/entities/payments.entity';
import { PaymentsModule } from 'src/payments/payments.module';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { PermissionsService } from 'src/permissions/permissions.service';
import { Product } from 'src/products/entities/products.entity';
import { ProductsService } from 'src/products/products.service';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { PromotionsService } from 'src/promotions/promotions.service';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { ReservationsService } from 'src/reservations/reservations.service';
import { Role } from 'src/roles/entities/roles.entity';
import { RolesService } from 'src/roles/roles.service';
import { Table } from 'src/tables/entities/tables.entity';
import { TablesService } from 'src/tables/tables.service';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forFeature([
      User,
      Order,
      Role,
      Discount,
      UserDiscount,
      Reservation,
      OrderProduct,
      Product,
      Payment,
      Promotion,
      Permission,
      Table,
      Area,
    ]),
    DiscountsModule,
    PaymentsModule,
    AreasModule,
  ],
  controllers: [UploadsController],
  providers: [
    UploadsService,
    AuthService,
    UsersService,
    JwtService,
    OrdersService,
    RolesService,
    UserDiscountService,
    ReservationsService,
    OrderProductService,
    ProductsService,
    PromotionsService,
    PermissionsService,
    TablesService,
  ],
  exports: [UploadsService],
})
export class UploadsModule {}
