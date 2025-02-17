import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { CartsService } from 'src/carts/carts.service';
import { CreateCartDto } from 'src/carts/dtos/create-cart.dto';
import { UpdateCartDto } from 'src/carts/dtos/update-cart.dto';
import { Cart } from 'src/carts/entities/carts.entity';
import { Product } from 'src/products/entities/products.entity';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { UsersService } from 'src/users/users.service';

@Controller('carts')
export class CartsController {
  constructor(
    private readonly cartService: CartsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.USER)
  async findAll(): Promise<Cart[]> {
    return await this.cartService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.USER)
  async findOne(@Param('id') id: string): Promise<Cart> {
    return await this.cartService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.USER)
  async createOne(
    @Body() createCartDto: CreateCartDto,
  ): Promise<Record<string, Cart[] | Product[]>> {
    return await this.cartService.createOne(createCartDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.USER)
  async updateOne(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
    @Query() queries: Record<string, string>,
  ): Promise<Record<string, Cart[] | Product[]>> {
    return await this.cartService.updateOne(id, updateCartDto, queries);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.USER)
  async deleteOne(
    @Param('id') id: string,
    @Query() queries: Record<string, string>,
  ): Promise<Record<string, Cart[] | Product[]>> {
    const products = await this.cartService.deleteOne(id);

    return {
      carts: await this.usersService.handleFindCartsOfUser(queries.userId),
      products,
    };
  }
}
