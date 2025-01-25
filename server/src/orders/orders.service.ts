import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DiscountContext } from 'src/discounts/discount.context';
import { DiscountsService } from 'src/discounts/discounts.service';
import { CreateOrderProductDto } from 'src/order-product/dtos/create-order-product.dto';
import { OrderProductService } from 'src/order-product/order-product.service';
import { UpdateOrderDto } from 'src/orders/dtos/update-order.dto';
import { Order } from 'src/orders/entities/orders.entity';
import { PaymentsService } from 'src/payments/payments.service';
import { ProductsService } from 'src/products/products.service';
import { PromotionsService } from 'src/promotions/promotions.service';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { setRelation } from 'src/utils/utils';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly discountContext: DiscountContext,
    private readonly orderProductService: OrderProductService,
    private readonly productsService: ProductsService,
    private readonly paymentsService: PaymentsService,
    private readonly discountsService: DiscountsService,
    private readonly userDiscountService: UserDiscountService,
    private readonly promotionsService: PromotionsService,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async findOneByUserId(
    id: string,
    includeDeleted = false,
    startOfDay?: Date,
    endOfDay?: Date,
  ): Promise<Order[]> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.payment', 'payment')
      .leftJoinAndSelect('order.order_details', 'order_details')
      .leftJoinAndSelect('order_details.product', 'product')
      .leftJoinAndSelect('order_details.order', 'tmp_order')
      .leftJoinAndSelect('order.reviews', 'review')
      .leftJoinAndSelect('order.discounts', 'discounts')
      .where('order.user.id = :id', { id });

    if (includeDeleted) {
      query.withDeleted();
    }

    if (startOfDay && endOfDay) {
      query.andWhere('order.createdAt BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      });
    }

    query.orderBy('order.createdAt', 'DESC');

    return await query.getMany();
  }

  async findOne(id: string): Promise<any> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.reviews', 'reviews')
      .leftJoinAndSelect('order.payment', 'payment')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.order_details', 'order_details')
      .leftJoinAndSelect('order_details.product', 'product')
      .where('order.id = :id', { id })
      .getOne();

    if (!order) throw new BadRequestException('Order Not Found.');

    return {
      ...order,
      products: order.order_details.map((order_detail) => ({
        productId: order_detail.product.id,
        name: order_detail.product.name,
        quantity: order_detail.quantity,
        is_available: order_detail.product.is_available,
        price: order_detail.product.price,
      })),
    };
  }

  async createOne(
    createOrderProductDto: CreateOrderProductDto,
    queries?: Record<string, string>,
  ): Promise<void> {
    if (!queries?.userId) {
      throw new BadRequestException('UserID Not Found.');
    }

    const { discountId, userId, promotionCode } = createOrderProductDto.order;

    if (discountId) {
      const discount =
        await this.discountsService.checkValidOfDiscount(discountId);

      if (discount) {
        await this.userDiscountService.decreaseUserDiscountQuantity(
          userId,
          discount.id,
        );
      }
    }

    const order = this.orderRepository.create(createOrderProductDto.order);

    await this.orderRepository.save(order);

    if (promotionCode) {
      const discountFromPromotion =
        await this.promotionsService.checkPromotionCode(promotionCode);

      await setRelation(
        this.orderRepository,
        Order,
        order,
        'discounts',
        discountFromPromotion.id,
        'add',
      );
    }

    if (discountId) {
      const discount =
        await this.discountsService.checkValidOfDiscount(discountId);

      await setRelation(
        this.orderRepository,
        Order,
        order,
        'discounts',
        discount.id,
        'add',
      );
    }

    const products =
      await this.productsService.transformProductAndQuantityToProducts(
        createOrderProductDto.products,
      );

    await this.orderProductService.createOrderDetails(order, products);

    await setRelation(
      this.orderRepository,
      Order,
      order,
      'user',
      queries.userId,
      'set',
    );
  }

  async updateOne(id: string, updateOrderDto: UpdateOrderDto): Promise<any> {
    const { order_details, payment_method, discountId, userId, ...res } =
      updateOrderDto;

    const order = await this.findOne(id);

    if (!order) throw new NotFoundException('Order Not Found.');

    await this.paymentsService.updatePaymentMethod(
      order.payment.id,
      payment_method,
    );

    if (!order_details || (order_details && !order_details.length))
      throw new BadRequestException(
        'Order details must be contain at least one product.',
      );

    const newPrice = await this.orderProductService.updateOrderDetails(
      order,
      order_details,
    );

    let discountedAmount = newPrice > 0 ? newPrice : 0;

    if (discountId) {
      const discount =
        await this.discountsService.checkValidOfDiscount(discountId);

      if (discount) {
        this.discountContext.setStrategy('percentage', discount.value);

        discountedAmount = this.discountContext.calculate(res.total_price);

        await this.userDiscountService.decreaseUserDiscountQuantity(
          userId,
          discountId,
        );
      }
    }

    await this.orderRepository.update(
      { id },
      {
        total_price: discountedAmount,
        delivery_address: res.delivery_address,
        delivery_method: res.delivery_method,
        note: res.note,
        ...(res.status ? { status: res.status } : {}),
        ...(res.admin_message ? { admin_message: res.admin_message } : {}),
      },
    );
  }

  async deleteOne(id: string, forceDelete: boolean): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .delete()
        .from('order_discount')
        .where('order_id = :orderId', { orderId: id })
        .execute();

      if (forceDelete) {
        await manager.delete(Order, { id });
      } else {
        await manager.softDelete(Order, { id });
      }
    });
  }

  public async transformOrderIds(orderIds: string[]): Promise<Order[]> {
    const orders: Order[] = [];

    for (const orderId of orderIds) {
      const order = await this.orderRepository.findOneBy({ id: orderId });

      if (!order) throw new NotFoundException('Order Not Found.');

      orders.push(order);
    }

    return orders;
  }
}
