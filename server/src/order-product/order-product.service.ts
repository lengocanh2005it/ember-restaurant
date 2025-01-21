import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { Product } from 'src/products/entities/products.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  public createOrderDetails = async (
    order: Order,
    items: Array<{ product: Product; quantity: number }>,
  ): Promise<void> => {
    for (const item of items) {
      const { product, quantity } = item;

      const newOrderDetails = this.orderProductRepository.create({
        quantity,
        unit_price: product.price,
        total_price: +(
          Math.floor(quantity * product.price * 100) / 100
        ).toFixed(2),
        order,
        product,
      });

      await this.orderProductRepository.save(newOrderDetails);
    }
  };

  public updateOrderDetails = async (
    order: Order,
    items: Array<{ product: Product; quantity: number }>,
  ): Promise<number> => {
    let total_price = 0;

    const orderProducts = await this.orderProductRepository.find({
      where: { order: { id: order.id } },
      relations: ['product'],
    });

    if (!orderProducts) {
      throw new NotFoundException('Order Not Found.');
    }

    const itemMap = new Map(items.map((item) => [item.product.id, item]));

    const productsToDelete = [];
    const updates = [];

    for (const orderProduct of orderProducts) {
      const item = itemMap.get(orderProduct.product.id);

      if (!item) {
        productsToDelete.push(orderProduct.id);

        const product = await this.dataSource.getRepository(Product).findOneBy({
          id: orderProduct.product.id,
        });

        if (product) {
          await this.dataSource
            .getRepository(Product)
            .update(
              { id: product.id },
              { stock: product.stock + orderProduct.quantity },
            );
        }
      } else {
        updates.push({
          orderProductId: orderProduct.id,
          quantity: item.quantity,
          total_price: +(
            Math.floor(item.quantity * orderProduct.unit_price * 100) / 100
          ).toFixed(2),
        });
      }
    }

    if (productsToDelete.length > 0) {
      for (const productToDelete of productsToDelete) {
        await this.orderProductRepository.delete(productToDelete);
      }
    }

    for (const update of updates) {
      const findOrderProduct = await this.orderProductRepository.findOne({
        where: {
          id: update.orderProductId,
        },
        relations: ['product'],
      });

      if (!findOrderProduct)
        throw new NotFoundException('Order Details Not Found.');

      const findProduct = await this.dataSource
        .getRepository(Product)
        .findOneBy({ id: findOrderProduct.product.id });

      if (!findProduct) throw new NotFoundException('Product Not Found.');

      const isInStock =
        findProduct.stock >= update.quantity - findOrderProduct.quantity;

      if (!isInStock)
        throw new BadRequestException('This product has out of stock.');

      await this.dataSource.getRepository(Product).update(
        { id: findProduct.id },
        {
          stock:
            findProduct.stock - update.quantity + findOrderProduct.quantity,
        },
      );

      await this.orderProductRepository.update(update.orderProductId, {
        quantity: update.quantity,
        total_price: update.total_price,
      });

      total_price += update.total_price;
    }

    for (const item of items) {
      const isExisting = orderProducts.some(
        (op) => op.product.id === item.product.id,
      );

      if (!isExisting) {
        const newOrderProduct = this.orderProductRepository.create({
          order,
          product: item.product,
          quantity: item.quantity,
          total_price: +(
            Math.floor(item.quantity * item.product.price * 100) / 100
          ).toFixed(2),
        });

        await this.orderProductRepository.save(newOrderProduct);

        total_price += newOrderProduct.total_price;
      }
    }

    return total_price;
  };
}
