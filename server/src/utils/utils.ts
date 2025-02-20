import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as signature from 'cookie-signature';
import { config } from 'dotenv';
import { CookieOptions, Request, Response } from 'express';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { Event } from 'src/events/entities/events.entity';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { Product } from 'src/products/entities/products.entity';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { RedisService } from 'src/redis/redis.service';
import { Review } from 'src/reviews/entities/reviews.entity';
import { Role } from 'src/roles/entities/roles.entity';
import { User } from 'src/users/entities/users.entity';
import {
  ACCESS_TOKEN_MAX_AGE,
  ApiResponseType,
  IS_PROD,
  REFRESH_TOKEN_MAX_AGE,
  SESSION_MAX_AGE,
  UserSessionData,
} from 'src/utils';
import { EntityManager, Repository } from 'typeorm';
import { SeederFactory, SeederFactoryManager } from 'typeorm-extension';
import * as crypto from 'crypto';

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

export const resetCookies = (res: Response) => {
  const cookies = [
    { name: 'isLoggedIn', httpOnly: IS_PROD, secure: IS_PROD },
    { name: 'refreshToken', httpOnly: IS_PROD, secure: IS_PROD },
    { name: 'user_session', httpOnly: IS_PROD, secure: IS_PROD },
    { name: 'accessToken', httpOnly: IS_PROD, secure: IS_PROD },
  ];

  cookies.forEach(({ name, httpOnly, secure }) => {
    res.cookie(name, '', {
      httpOnly,
      secure,
      maxAge: 0,
      sameSite: IS_PROD ? 'none' : 'lax',
    });
  });
};

interface Repositories {
  permissionRepository: Repository<Permission>;
  roleRepository: Repository<Role>;
  userRepository: Repository<User>;
  productRepository: Repository<Product>;
  eventRepository: Repository<Event>;
  notificationRepository: Repository<Notification>;
  discountRepository: Repository<Discount>;
  promotionRepository: Repository<Promotion>;
  reviewRepository: Repository<Review>;
}

export function getRepositories(dataSource: EntityManager): Repositories {
  return {
    permissionRepository: dataSource.getRepository(Permission),
    roleRepository: dataSource.getRepository(Role),
    userRepository: dataSource.getRepository(User),
    productRepository: dataSource.getRepository(Product),
    eventRepository: dataSource.getRepository(Event),
    notificationRepository: dataSource.getRepository(Notification),
    discountRepository: dataSource.getRepository(Discount),
    promotionRepository: dataSource.getRepository(Promotion),
    reviewRepository: dataSource.getRepository(Review),
  };
}

export const getFactories = (
  factoryManager: SeederFactoryManager,
): Record<string, SeederFactory<any, unknown>> => {
  return {
    permissionFactory: factoryManager.get(Permission),
    roleFactory: factoryManager.get(Role),
    userFactory: factoryManager.get(User),
    productFactory: factoryManager.get(Product),
    eventFactory: factoryManager.get(Event),
    notificationFactory: factoryManager.get(Notification),
    discountFactory: factoryManager.get(Discount),
    promotionFactory: factoryManager.get(Promotion),
    reviewFactory: factoryManager.get(Review),
  };
};

const MASTER_KEY_HEX = process.env.MASTER_KEY;

export const handleEncryptSecret = (
  secret: string,
): { encryptedData: string; iv: string } => {
  const algorithm = 'aes-256-cbc';
  const iv = crypto.randomBytes(16);
  const MASTER_KEY = Buffer.from(MASTER_KEY_HEX, 'hex');
  const cipher = crypto.createCipheriv(algorithm, MASTER_KEY, iv);
  let encrypted = cipher.update(secret, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
  };
};

export const handleDecryptSecret = (
  encryptedData: string,
  iv: string,
): string => {
  const algorithm = 'aes-256-cbc';
  const MASTER_KEY = Buffer.from(MASTER_KEY_HEX, 'hex');
  const decipher = crypto.createDecipheriv(
    algorithm,
    MASTER_KEY,
    Buffer.from(iv, 'hex'),
  );

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
