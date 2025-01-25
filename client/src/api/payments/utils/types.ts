export type CreatePaymentDto = {
  amount: number;
  payment_method: "cash" | "card" | "paypal" | "apple-pay";
  currency: "usd" | "euro";
  type: "order" | "reservation";
  userId: string;
  orderId?: string;
  reservationId?: string;
  payment_method_id?: string;
  description?: string;
};
