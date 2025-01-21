import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCartDto } from 'src/carts/dtos/create-cart.dto';
import { UpdateCartDto } from 'src/carts/dtos/update-cart.dto';
import { Cart } from 'src/carts/entities/carts.entity';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  async findAll(): Promise<Cart[]> {
    return await this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.user', 'user')
      .select(['cart', 'user.id', 'user.name', 'user.username'])
      .getMany();
  }

  async findOne(id: string): Promise<Cart> {
    return await this.cartRepository.findOneBy({ id });
  }

  async createOne(cartCreateDto: CreateCartDto): Promise<any> {
    const { userId, productId, quantity } = cartCreateDto;

    const product = await this.productsService.findOne(productId);

    const user = await this.usersService.findOne(userId);

    const cart = await this.cartRepository.findOne({
      where: {
        product: { id: product.id },
        user: { id: user.id },
      },
      relations: ['product', 'user'],
    });

    if (cart) {
      await this.cartRepository.update(
        { id: cart.id },
        { quantity: cart.quantity + quantity },
      );

      await this.productsService.updateStockNumberProduct(productId, quantity);

      if (cartCreateDto.note) {
        await this.cartRepository.update(
          { id: cart.id },
          { note: cartCreateDto.note },
        );
      }

      return {
        carts: await this.usersService.handleFindCartsOfUser(userId),
        products: await this.productsService.findAll(),
      };
    }

    const newCart = this.cartRepository.create(cartCreateDto);

    await this.cartRepository.save(newCart);

    await this.productsService.updateStockNumberProduct(productId, quantity);

    await this.cartRepository
      .createQueryBuilder('cart')
      .relation(Cart, 'product')
      .of(newCart.id)
      .set(product.id);

    await this.cartRepository
      .createQueryBuilder('cart')
      .relation(Cart, 'user')
      .of(newCart.id)
      .set(user.id);

    return await this.usersService.handleFindCartsOfUser(userId);
  }

  async updateOne(
    id: string,
    updateCartDto: UpdateCartDto,
    queries?: Record<string, string>,
  ): Promise<Cart[]> {
    const cart = await this.findOne(id);

    if (!cart) throw new BadRequestException('Cart Not Found.');

    await this.cartRepository.update({ id }, updateCartDto);

    return await this.usersService.handleFindCartsOfUser(queries.userId);
  }

  async deleteOne(id: string): Promise<void> {
    const cart = await this.cartRepository.findOneBy({ id });

    if (!cart) throw new NotFoundException('Cart Not Found.');

    await this.cartRepository.delete({ id });
  }
}
