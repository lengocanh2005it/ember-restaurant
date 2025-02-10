import { CacheModule } from '@nestjs/cache-manager';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { ApiResponseInterceptor } from 'src/utils/common/interceptors/api-response.interceptor';
import { HttpExceptionFilter } from 'src/utils/common/filters/http-exception.filter';
import { LoggerMiddleware } from 'src/utils/common/middlewares/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AreasModule } from './areas/areas.module';
import { AuthModule } from './auth/auth.module';
import { CartsModule } from './carts/carts.module';
import { DiscountsModule } from './discounts/discounts.module';
import { EmailsModule } from './emails/emails.module';
import { EventsModule } from './events/events.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrderProductModule } from './order-product/order-product.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ProductsModule } from './products/products.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ReviewsModule } from './reviews/reviews.module';
import { RolesModule } from './roles/roles.module';
import { SupportTicketModule } from './support_ticket/support-ticket.module';
import { TablesModule } from './tables/tables.module';
import { TicketMessagesModule } from './ticket_messages/ticket_messages.module';
import { UploadsModule } from './uploads/uploads.module';
import { UserDiscountModule } from './user-discount/user-discount.module';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    CacheModule.register({
      max: 100,
      ttl: 20,
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseModule],
      inject: [DatabaseService],
      useFactory: async (databaseService: DatabaseService) => {
        return databaseService.getDataSourceOptions();
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 10,
      },
      {
        name: 'long',
        ttl: 50000,
        limit: 30,
      },
    ]),
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    ProductsModule,
    OrdersModule,
    CartsModule,
    DiscountsModule,
    UserDiscountModule,
    OrderProductModule,
    ReservationsModule,
    NotificationsModule,
    ReviewsModule,
    EventsModule,
    PromotionsModule,
    SupportTicketModule,
    UploadsModule,
    EmailsModule,
    PaymentsModule,
    TablesModule,
    AreasModule,
    DatabaseModule,
    TicketMessagesModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
