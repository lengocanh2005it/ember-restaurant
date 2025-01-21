import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { DiscountsService } from 'src/discounts/discounts.service';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { Discount } from 'src/discounts/entities/discounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion, Discount]), DiscountsModule],
  providers: [PromotionsService, DiscountsService],
  controllers: [PromotionsController],
  exports: [PromotionsService],
})
export class PromotionsModule {}
