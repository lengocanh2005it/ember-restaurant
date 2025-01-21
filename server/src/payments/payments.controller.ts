import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { CreatePaymentDto } from 'src/payments/dtos/create-payment.dto';
import { PaymentsService } from 'src/payments/payments.service';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { UsersService } from 'src/users/users.service';
import { CreateOrderData, CreateReservationData } from 'src/utils';
import Stripe from 'stripe';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async getPayments(): Promise<Stripe.PaymentIntent[]> {
    return await this.paymentsService.getPayments();
  }

  @Get('intents/:id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async getPaymentIntentDetails(
    @Param('id') paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    return await this.paymentsService.getPaymentIntentDetails(paymentIntentId);
  }

  @Get('methods/:id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async getPaymentMethodDetails(
    @Param('id') paymentMethodId: string,
  ): Promise<Stripe.PaymentMethod> {
    return await this.paymentsService.getPaymentMethodDetails(paymentMethodId);
  }

  @Post('card')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async handlePayment(
    @Body('payments') createPaymentDto: CreatePaymentDto,
    @Body('order') createOrderDto: CreateOrderData,
    @Body('reservation') createReservationDto: CreateReservationData,
  ): Promise<any> {
    await this.paymentsService.handlePaymentByCard(
      createPaymentDto,
      createOrderDto,
      createReservationDto,
    );

    const { userId } = createPaymentDto;

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { password, createdAt, updatedAt, ...res } =
      await this.usersService.findOne(userId);

    if (createReservationDto || createPaymentDto.reservationId) {
      return {
        reservations:
          await this.usersService.handleFindReservationsOfUser(userId),
        profile: res,
        discounts: await this.usersService.handleFindDiscountsOfUser(userId),
      };
    } else if (createOrderDto || createPaymentDto.orderId) {
      return {
        orders: await this.usersService.handleFindOrdersOfUsers(userId),
        profile: res,
        discounts: await this.usersService.handleFindDiscountsOfUser(userId),
      };
    }
  }
}
