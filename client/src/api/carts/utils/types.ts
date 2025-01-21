export type CreateCartDto = {
  productId: string;
  userId: string;
  quantity: number;
  note?: string;
};

export type DeleteCartDto = {
  cartId: string;
  userId: string;
};

export type UpdateCartDto = {
  cartId: string;
  quantity: number;
  userId: string;
  note?: string;
};
