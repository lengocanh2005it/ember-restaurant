import { User } from 'src/users/entities/users.entity';
import 'express-session';
import 'express';

export type CreateSocialAccount = {
  email?: string;
  displayName: string;
  socialId: string;
  provider: string;
  imageUrl: string;
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

export type UserSessionData = {
  userId: string;
  accessToken: string;
  refreshToken: string;
  role: string[];
  username?: string;
  login_method: string;
  expiresAt?: number;
};

export type GenerateTokensType = {
  accessToken: string;
  refreshToken: string;
};

export type SocialLoginType = GenerateTokensType & {
  userId: string;
  sessionID: string;
};

export type UserGoogleData = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
};

export type UserFacebookData = {
  id: string;
  name: string;
  picture: {
    heigh: number;
    is_silhouette: boolean;
    url: string;
    width: number;
  };
};

declare module 'express-session' {
  interface SessionData {
    user?: UserSessionData;
  }
}

declare module 'express' {
  interface Request {
    user?: User;
  }
}
