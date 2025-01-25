import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacebookStrategy } from 'src/auth/strategies/facebook.strategy';
import { GoogleStrategy } from 'src/auth/strategies/google.strategy';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { SessionSerializer } from 'src/auth/utils/serializer';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { EmailsModule } from 'src/emails/emails.module';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { OrderProductModule } from 'src/order-product/order-product.module';
import { Order } from 'src/orders/entities/orders.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { OrdersService } from 'src/orders/orders.service';
import { Payment } from 'src/payments/entities/payments.entity';
import { PaymentsService } from 'src/payments/payments.service';
import { PermissionsModule } from 'src/permissions/permissions.module';
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
import { UploadsModule } from 'src/uploads/uploads.module';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { User } from 'src/users/entities/users.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { StripeService } from 'src/payments/services/stripe.service';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      Order,
      User,
      Reservation,
      OrderProduct,
      Payment,
      Promotion,
      Table,
    ]),
    PassportModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    DiscountsModule,
    UploadsModule,
    OrdersModule,
    ReservationsModule,
    UserDiscountModule,
    ProductsModule,
    EmailsModule,
    OrderProductModule,
    PromotionsModule,
    TablesModule,
    PaymentsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_TOKEN_LIFE'),
        },
      }),
    }),
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RolesService,
    OrdersService,
    UsersService,
    ReservationsService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    SessionSerializer,
    PaymentsService,
    StripeService,
  ],
})
export class AuthModule {}
