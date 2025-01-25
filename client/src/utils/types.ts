export type User = {
  id: string;
  username: string;
  name: string;
  job: string;
  email: string;
  phone: string;
  address: string;
  theme: string;
  total_orders: number;
  total_reservations: number;
  loyalty_points: number;
  roles: string[];
  support_tickets?: Request[];
  image: string;
  google_id?: string;
  facebook_id?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Payment = {
  id: string;
  payment_intent_id: string;
  payment_method_id: string;
  amount: number;
  payment_method: string;
  type: string;
  currency: string;
  status: string;
};

export type Table = {
  id: string;
  name: string;
  note?: string;
  capacity: number;
  status: string;
  is_reserved: boolean;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  area: Area;
};

export type TicketMessage = {
  id: string;
  message: string;
  sender_type: string;
  createdAt: Date;
  updatedAt: Date;
  sender: User;
  support_ticket: Request;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  average_rating?: number;
  rating_count?: number;
  category: string;
  image: string;
  ingredients: string;
  is_available: boolean;
  is_featured: boolean;
  stock: number;
  reviews?: Review[];
};

export type Area = {
  id: string;
  name: string;
  capacity: number;
  description?: string;
  is_full: boolean;
  floor_number: number;
  status: string;
  operating_hours: string;
  createdAt: Date;
  updatedAt: Date;
  tables: Table[];
};

export type Cart = {
  id: string;
  quantity: number;
  note?: string;
  user: User;
  product: Product;
};

export type Discount = {
  id: string;
  type: string;
  value: number;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  currency: string;
};

export type Event = {
  id: string;
  image: string;
  title: string;
  start_date: string;
  end_date: string;
  description: string;
  status: string;
  guests_number: number;
  note?: string;
  type: string;
};

export type OrderDetails = {
  id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  note?: string;
  order: Order;
  product: Product;
};

export type Order = {
  id: string;
  createdAt: Date;
  delivery_address?: string;
  delivery_method: string;
  discounts?: Discount[];
  note?: string;
  status: string;
  total_price: number;
  order_details: OrderDetails[];
  is_paid: boolean;
  admin_message?: string;
  payment: Payment;
  user: User;
};

export type PaymentPayload = {
  orderId: string;
  userId: string;
  totalPrice: number;
};

export type ReviewsDetails = {
  id: string;
  comment: string;
  date: string;
  rating_number: number;
  user: User;
};

export type Promotion = {
  id: string;
  title: string;
  description: string;
  note?: string;
  start_date: string;
  end_date: string;
  code: string;
  image: string;
  discount: Discount;
};

export type Request = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  original_request: string;
  status: string;
  ticket_messages?: TicketMessage[];
};

export type Notification = {
  id: string;
  image: string;
  title: string;
  createdAt: Date;
  number: number;
  content: string;
  name: string;
};

export type Review = {
  id: string;
  user: User;
  type: string;
  rating_number: number;
  comment: string;
  date: Date;
  is_featured: boolean;
};

export type UserPayload = {
  id: string;
  username: string;
  name: string;
  job: string;
  email: string;
  phone: string;
  address: string;
  theme: string;
  total_orders: number;
  current_reservations: number;
  loyalty_points: number;
  roles?: string[];
  image: string;
  status: string; // different from type User
};

export type UserProfile = {
  id: string;
  name: string;
  job: string;
  email: string;
  phone: string;
  address: string;
  image?: File;
};

export type DiscountWithQuantity = {
  discount: Discount;
  quantity: number;
};

export type OrderPayment = {
  orderId: string;
  totalPrice: number;
};

export type ReservationPayment = {
  reservationId: string;
  totalPrice: number;
};

export type Reservation = {
  id: string;
  is_paid: boolean;
  date_time: Date;
  guests_count: number;
  status: string;
  note?: string;
  discount?: Discount;
  admin_message?: string;
  total_price: number;
  reviews: Review[];
  tables: Table[];
  payment: Payment;
  user: User;
};

export type JwtPayload = {
  exp: number;
  facebookId: string | null;
  googleId: string | null;
  iat: number;
  id: string;
  image: string;
  roles: string[];
  theme: string;
  username: string | null;
};

export type CachedOrderData = {
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

export type CachedReservationData = {
  reservationId?: string;
  date_time: Date;
  userId: string;
  payment_method: string;
  note?: string;
  discountId?: string;
  promotionCode?: string;
  guests_count: number;
  areaId: string;
  tableIds: string[];
};

export type Theme = {
  theme: string;
};
