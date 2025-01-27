import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { CreatePaymentDto } from 'src/payments/dtos/create-payment.dto';
import { PaymentsService } from 'src/payments/payments.service';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { UsersService } from 'src/users/users.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const { userId, type } = createPaymentDto;

    await this.paymentsService.createPayment(createPaymentDto);

    if (type === 'order') {
      return {
        orders: await this.usersService.handleFindOrdersOfUsers(userId),
        discounts: await this.usersService.handleFindDiscountsOfUser(userId),
      };
    } else if (type === 'reservation') {
      return {
        reservations:
          await this.usersService.handleFindReservationsOfUser(userId),
        discounts: await this.usersService.handleFindDiscountsOfUser(userId),
      };
    }
  }

  @Post('webhook/stripe')
  async handleStripeWebhook(
    @Headers() headers: Record<string, string>,
    @Body() payload: any,
  ) {
    return await this.paymentsService.handleStripeWebhook(headers, payload);
  }
}
