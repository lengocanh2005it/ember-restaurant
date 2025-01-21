import { Cart } from 'src/carts/entities/carts.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { Review } from 'src/reviews/entities/reviews.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ unique: true })
  readonly name!: string;

  @Column()
  readonly description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  readonly price!: number;

  @Column({
    type: 'enum',
    enum: [
      'appetizer',
      'dessert',
      'hotpot',
      'main_course',
      'beverage',
      'signature_dishes',
      'snack',
    ],
  })
  readonly category!: string;

  @Column()
  readonly ingredients!: string;

  @Column({ type: 'int', default: 0 })
  readonly rating_count!: number;

  @Column({ type: 'float', default: 0 })
  readonly average_rating!: number;

  @Column({ type: 'int' })
  readonly stock!: number;

  @Column()
  readonly image!: string;

  @Column({ type: 'boolean', default: true })
  readonly is_available?: boolean;

  @Column({ type: 'boolean', default: false })
  readonly is_featured?: boolean;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product, {
    cascade: true,
  })
  readonly order_details!: OrderProduct[];

  @OneToMany(() => Review, (review) => review.product, {
    cascade: true,
    nullable: true,
  })
  readonly reviews?: Review[];

  @OneToOne(() => Cart, (cart) => cart.product, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  readonly cart?: Cart;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;
}
