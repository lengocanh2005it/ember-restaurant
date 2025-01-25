import { Injectable } from '@nestjs/common';
import { DiscountStrategy } from 'src/discounts/strategies/discount.strategy';

@Injectable()
export class FixedAmountDiscountStrategy implements DiscountStrategy {
  constructor(private readonly fixedAmount: number) {}

  calculateDiscount(amount: number): number {
    return Math.max(this.fixedAmount, amount - this.fixedAmount);
  }
}
