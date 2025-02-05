import { BadRequestException, Injectable } from '@nestjs/common';
import { DiscountStrategyFactory } from 'src/discounts/discount.factory';
import { DiscountStrategy } from 'src/discounts/strategies/discount.strategy';

@Injectable()
export class DiscountContext {
  private strategy: DiscountStrategy;

  constructor(
    private readonly discountStrategyFactory: DiscountStrategyFactory,
  ) {}

  setStrategy(discountType: string, value: number) {
    this.strategy = this.discountStrategyFactory.createStrategy(
      discountType,
      value,
    );
  }

  calculateDiscount(amount: number): number {
    if (!this.strategy) throw new BadRequestException('Unknown Strategy!');
    return this.strategy.calculateDiscount(amount);
  }
}
