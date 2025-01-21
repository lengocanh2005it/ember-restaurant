export type UserGoogleDetails = {
  email: string;
  displayName: string;
  googleId: string;
};

export type UserFacebookDetails = {
  email: string;
  displayName: string;
  facebookId: string;
};

export type OrderPaymentPayload = {
  orderId: string;
  userId: string;
  totalPrice: number;
};

export type ReservationPaymentPayload = {
  reservationId: string;
  userId: string;
  totalPrice: number;
  totalPriceInput: number;
};

export type UserSessionPayload = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};

export type ImageResponse = {
  imageUrl: string;
};

export type CreateOrderData = {
  orderId?: string;
  total_price: number;
  delivery_method: string;
  payment_method: string;
  delivery_address?: string;
  phone_number: string;
  note?: string;
  products: {
    productId: string;
    quantity: number;
  }[];
  discountId?: string;
  promotionCode?: string;
};

export type CreateReservationData = {
  date_time: Date;
  reservationId?: string;
  payment_method: string;
  note?: string;
  guests_count: number;
  areaId: string;
  tableIds: string[];
  discountId?: string;
  promotionCode?: string;
};

export type Theme = {
  theme: string;
};

export type GoogleLoginData = {
  name: string;
  email: string;
  image: string;
};

export type LoyaltyPointPayload = {
  point: number;
};
