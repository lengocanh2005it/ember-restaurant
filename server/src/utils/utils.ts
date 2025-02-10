import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as signature from 'cookie-signature';
import { config } from 'dotenv';
import { CookieOptions, Request, Response } from 'express';
import { CreateDiscountDto } from 'src/discounts/dtos/create-discount.dto';
import { CreateProductDto } from 'src/products/dtos/create-product.dto';
import { RedisService } from 'src/redis/redis.service';
import {
  ACCESS_TOKEN_MAX_AGE,
  ApiResponseType,
  IS_PROD,
  REFRESH_TOKEN_MAX_AGE,
  SESSION_MAX_AGE,
  UserSessionData,
} from 'src/utils';
import { Repository } from 'typeorm';

config();

const configService = new ConfigService();

export const generateID = (prefix: string) => {
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return prefix + randomPart;
};

export const calculateNumber = (value: number): number => {
  return parseFloat((Math.round(value * 100) / 100).toFixed(2));
};

export const handleFormatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  let period = 'AM';
  let hour = parseInt(hours, 10);

  if (hour >= 12) {
    period = 'PM';
    if (hour > 12) {
      hour -= 12;
    }
  } else if (hour === 0) {
    hour = 12;
  }

  return `${hour.toString().padStart(2, '0')}:${minutes} ${period}`;
};

export const generateRandomValue = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const setRelation = async (
  repository: Repository<any>,
  entity: any,
  entityInstance: any,
  relation: string,
  targetId: number | string,
  action: 'set' | 'add' = 'set',
): Promise<void> => {
  const queryBuilder = repository
    .createQueryBuilder()
    .relation(entity, relation)
    .of(entityInstance.id);

  if (action === 'set') {
    await queryBuilder.set(targetId);
  } else if (action === 'add') {
    await queryBuilder.add(targetId);
  } else {
    throw new Error(`Unsupported action: ${action}`);
  }
};

export const generateDiscount = (
  value: number,
  description?: string,
): CreateDiscountDto => {
  const start_date = new Date();
  const end_date = new Date(start_date);
  end_date.setDate(start_date.getDate() + 7);

  return {
    type: 'percentage',
    value,
    description,
    start_date,
    end_date,
    is_active: true,
    currency: 'usd',
  };
};

export const generateProducts = (): CreateProductDto[] => {
  return [
    {
      name: 'Tasty Navajo Bread',
      description:
        'Soft and fluffy Navajo bread, perfectly fried to golden brown and served with a variety of toppings.',
      price: 12.2,
      stock: 100,
      image:
        'https://res.cloudinary.com/daiqcjyk9/image/upload/v1735439862/specialty_dish-5_kfdfrw.png',
      category: 'snack',
      ingredients: 'Flour, baking powder, salt, water, vegetable oil',
      is_featured: true,
    },

    {
      name: 'Grilled Salmon',
      description:
        'A perfectly grilled salmon filet served with lemon butter sauce.',
      price: 12.56,
      stock: 150,
      image:
        'https://res.cloudinary.com/daiqcjyk9/image/upload/v1735464360/grill_salmon_jxheqk.png',
      category: 'main_course',
      ingredients: 'Salmon, olive oil, lemon, garlic, salt, pepper, parsley',
      is_featured: true,
    },

    {
      name: 'Stir-Fried Noodles',
      description:
        'Delicious stir-fried noodles with fresh vegetables and assorted meats, full of flavor.',
      price: 15.6,
      stock: 50,
      image:
        'https://res.cloudinary.com/daiqcjyk9/image/upload/v1735464427/main_courses-6_el1ii7.png',
      category: 'main_course',
      ingredients:
        'Noodles, chicken, beef, shrimp, bell peppers, carrots, soy sauce',
      is_featured: true,
    },

    {
      name: 'Fried Chicken',
      description:
        'Crispy and juicy fried chicken, seasoned with a blend of spices.',
      price: 15.24,
      stock: 100,
      image:
        'https://res.cloudinary.com/daiqcjyk9/image/upload/v1735464578/fried_chicken_o5h7si.png',
      category: 'appetizer',
      ingredients:
        'Chicken, flour, eggs, breadcrumbs, garlic powder, paprika, salt, pepper, oil',
      is_featured: true,
    },
  ];
};

export const encodePassword = (password: string) => {
  const SALT = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, SALT);
};

export const formatApiResponse = <T>(
  statusCode: number,
  message: string,
  data?: T,
  error?: string,
): ApiResponseType => {
  return {
    statusCode,
    message,
    ...(data && { data }),
    ...(error && { error }),
  };
};

export const getEnvValue = (prodKey: string, devKey: string) => {
  const environment = configService.get<string>('NODE_ENV');

  return environment === 'production'
    ? configService.get<string>(prodKey)
    : configService.get<string>(devKey);
};

export const getDataOfSessionFromRequest = async (
  request: Request,
  configService: ConfigService,
  redisService: RedisService,
): Promise<UserSessionData> => {
  const sessionID = request.cookies['user_session'];

  if (!sessionID) throw new UnauthorizedException('User Not Authenticated.');

  if (!(sessionID as string).startsWith('s:'))
    throw new BadRequestException('Invalid SessionID.');

  const unsignedSessionID = signature.unsign(
    sessionID.slice(2),
    configService.get<string>('SESSION_SECRET_KEY') as string,
  );

  if (!unsignedSessionID)
    throw new BadRequestException('Invalid session signature.');

  const data = await redisService.getKey(`sess:${unsignedSessionID}`);

  if (!data) throw new BadRequestException('Unknown type of data.');

  return JSON.parse(data as string).user;
};

export const initializeCookies = (
  response: Response,
  accessToken: string,
  refreshToken: string,
): void => {
  response.cookie('isLoggedIn', 'true', createCookieOptions(SESSION_MAX_AGE));

  response.cookie(
    'refreshToken',
    refreshToken,
    createCookieOptions(REFRESH_TOKEN_MAX_AGE),
  );

  response.cookie(
    'accessToken',
    accessToken,
    createCookieOptions(ACCESS_TOKEN_MAX_AGE),
  );
};

export const createCookieOptions = (maxAge: number): Partial<CookieOptions> => {
  return {
    httpOnly: IS_PROD,
    secure: IS_PROD,
    maxAge,
    sameSite: IS_PROD ? 'none' : 'lax',
  };
};
