export type CreateDiscountDto = {
  type: string;
  value: number;
  description?: string;
  start_date: Date;
  end_date: Date;
  currency: string;
};

export type UpdateDiscountDto = {
  discountId: string;
  type: string;
  value: number;
  description?: string;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  currency: string;
};
