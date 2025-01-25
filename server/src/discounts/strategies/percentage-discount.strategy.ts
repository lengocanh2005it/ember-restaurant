import { Injectable } from '@nestjs/common';
import { DiscountStrategy } from 'src/discounts/strategies/discount.strategy';

@Injectable()
export class PercentageDiscountStrategy implements DiscountStrategy {
  constructor(private readonly percentage: number) {}

  calculateDiscount(amount: number): number {
    const discount = (this.percentage / 100) * amount;
    return parseFloat(discount.toFixed(2));
  }
}
