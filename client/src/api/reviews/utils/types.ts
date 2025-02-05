export type CreateReviewDto = {
  rating_number?: number;
  comment: string;
  userId: string;
  date: Date;
  type: string;
  productId?: string;
  orderIds?: string[];
  reservationIds?: string[];
};

export type DeleteReviewDto = {
  reviewId: string;
  userId: string;
};

export type UpdateReviewDto = {
  rating_number?: number;
  comment: string;
  userId: string;
  date: Date;
  type: string;
  productId?: string;
  orderIds?: string[];
  reservationIds?: string[];
  is_featured?: boolean;
};

export type UpdateFeaturedReviewDto = {
  reviewIds: string[];
  userId: string;
};
