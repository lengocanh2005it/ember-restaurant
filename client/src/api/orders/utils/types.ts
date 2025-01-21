import { OrderDetails, Product } from "@/utils/types";

export type CreateOrderDto = {
  userId: string;
  phone_number: string;
  note?: string;
  delivery_method: string;
  payment_method: string;
  delivery_address?: string;
  discountId?: string;
  total_price: number;
  status: string;
  promotionCode?: string;
};

export type CreateProductOfOrderDto = {
  productId: string;
  quantity: number;
};

export type CreateOrderDetailsDto = {
  order: CreateOrderDto;
  products: CreateProductOfOrderDto[];
  userId: string;
};

export type DeleteOrderOptionsDto = {
  orderId: string;
  modeOption: string;
  userId: string;
};

export type UpdateOrderDto = {
  createdAt: Date;
  id: string;
  delivery_address?: string;
  delivery_method: string;
  discountId?: string;
  note?: string;
  payment_method: string;
  status: string;
  total_price: number;
  order_details: OrderDetails[];
  userId: string;
  admin_message?: string;
  promotionCode?: string;
};
