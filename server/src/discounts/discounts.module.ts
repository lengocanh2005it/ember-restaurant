import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountContext } from 'src/discounts/discount.context';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { DiscountStrategyFactory } from 'src/discounts/discount.factory';

@Module({
  imports: [TypeOrmModule.forFeature([Discount])],
  controllers: [DiscountsController],
  providers: [DiscountsService, DiscountContext, DiscountStrategyFactory],
  exports: [DiscountsService, DiscountContext, DiscountStrategyFactory],
})
export class DiscountsModule {}
