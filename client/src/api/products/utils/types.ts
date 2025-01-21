export type DeleteReviewOfProductDto = {
  productId: string;
  reviewId: string;
  option: string;
};

export type FetchProductDto = {
  productId: string;
  option: string;
};

export type CreateProductDto = {
  name: string;
  description: string;
  price: number;
  category: string;
  image: File;
  ingredients: string;
  stock: number;
};

export type UpdateProductDto = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string;
  is_available: boolean;
  is_featured: boolean;
  stock: number;
};
