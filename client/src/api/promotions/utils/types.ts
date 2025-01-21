export type CreatePromotionDto = {
  title: string;
  description: string;
  image: File;
  start_date: Date;
  end_date: Date;
  note?: string;
  code: string;
  discountId?: string;
};

export type UpdatePromotionDto = {
  promotionId: string;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  note?: string;
  code: string;
};
