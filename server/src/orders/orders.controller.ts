import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { CreateOrderProductDto } from 'src/order-product/dtos/create-order-product.dto';
import { UpdateOrderDto } from 'src/orders/dtos/update-order.dto';
import { Order } from 'src/orders/entities/orders.entity';
import { OrdersService } from 'src/orders/orders.service';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { UsersService } from 'src/users/users.service';
import { ResponseMessage } from 'src/utils/common/decorators/response-message.decorator';

@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @ResponseMessage('Get orders successfully!')
  async findAll(): Promise<Order[]> {
    return await this.ordersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Get order successfully!')
  async findOne(@Param('id') id: string): Promise<any> {
    return await this.ordersService.findOne(id);
  }

  @Post()
  async createOne(
    @Body() createOrderProductDto: CreateOrderProductDto,
    @Query() queries: Record<string, string>,
  ): Promise<any> {
    await this.ordersService.createOne(createOrderProductDto, queries);
    return {
      orders: await this.usersService.handleFindOrdersOfUsers(queries.userId),
      discounts: await this.usersService.handleFindDiscountsOfUser(
        queries.userId,
      ),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async deleteOne(
    @Param('id') id: string,
    @Query('delete') deleteOption: string,
    @Query('userId') userId: string,
  ): Promise<void> {
    const forceDelete: boolean = deleteOption === 'hard';
    await this.ordersService.deleteOne(id, forceDelete);
    return await this.usersService.handleFindOrdersOfUsers(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER, Role.MANAGER)
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<any> {
    await this.ordersService.updateOne(id, updateOrderDto);
    return await this.usersService.handleFindOrdersOfUsers(
      updateOrderDto.userId,
    );
  }
}
