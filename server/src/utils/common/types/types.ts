import { User } from 'src/users/entities/users.entity';

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

export type ImageResponse = {
  imageUrl: string;
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

export type ApiResponseType<T = any> = {
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
};

export type CreateStripeIntent = {
  amount: number;
  currency: string;
  payment_method: string;
  metadata?: {
    orderId?: string;
    reservationId?: string;
    type: string;
    paymentId: string;
    userId: string;
  };
  user: User;
  description?: string;
};

export type JwtPayload = {
  userId: string;
  iat: number;
  exp: number;
};

export type SessionData = {
  userId: string;
  accessToken: string;
  refreshToken: string;
  role: string;
  username?: string;
  login_method: string;
  expiresAt?: number;
};
