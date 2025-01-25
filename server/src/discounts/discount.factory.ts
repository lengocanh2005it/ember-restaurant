import { BadRequestException } from '@nestjs/common';
import { DiscountStrategy } from 'src/discounts/strategies/discount.strategy';
import { FixedAmountDiscountStrategy } from 'src/discounts/strategies/fixed-discount.strategy';
import { PercentageDiscountStrategy } from 'src/discounts/strategies/percentage-discount.strategy';

export class DiscountStrategyFactory {
  createStrategy(type: string, value: number): DiscountStrategy {
    switch (type) {
      case 'percentage': {
        return new PercentageDiscountStrategy(value);
      }
      case 'fixed': {
        return new FixedAmountDiscountStrategy(value);
      }
      default:
        throw new BadRequestException('Unknown Discount Strategy!');
    }
  }
}
