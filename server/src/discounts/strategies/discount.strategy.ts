export interface DiscountStrategy {
  calculateDiscount(amount: number): number;
}
