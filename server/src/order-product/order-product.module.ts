import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { OrderProductService } from 'src/order-product/order-product.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProduct])],
  providers: [OrderProductService],
  exports: [OrderProductService],
})
export class OrderProductModule {}
