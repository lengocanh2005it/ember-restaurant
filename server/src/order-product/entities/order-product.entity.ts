import { Order } from 'src/orders/entities/orders.entity';
import { Product } from 'src/products/entities/products.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'order_product' })
export class OrderProduct {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'int' })
  readonly quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  readonly unit_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  readonly total_price!: number;

  @Column({ nullable: true })
  readonly note?: string;

  @ManyToOne(() => Order, (order) => order.order_details, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  readonly order!: Order;

  @ManyToOne(() => Product, (product) => product.order_details, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  readonly product!: Product;
}
