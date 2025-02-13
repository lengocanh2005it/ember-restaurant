import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RedisStore } from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as session from 'express-session';
import helmet from 'helmet';
import * as passport from 'passport';
import { DatabaseService } from 'src/database/database.service';
import { RedisService } from 'src/redis/redis.service';
import { getEnvValue, IS_PROD, SESSION_MAX_AGE } from 'src/utils';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: getEnvValue('ORIGINAL_FE_URL_PROD', 'ORIGINAL_FE_URL_DEV'),
    credentials: true,
  });
  app.use(cookieParser());
  app.use(
    '/payments/webhook/stripe',
    express.raw({ type: 'application/json' }),
  );
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);
  const configService = app.get(ConfigService);
  const databaseService = app.get(DatabaseService);
  const redisService = app.get(RedisService);
  const PORT = configService.get<number>('PORT_DEV');
  app.use(
    session({
      name: 'user_session',
      store: new RedisStore({
        client: redisService.getInstance(),
      }),
      secret: configService.get<string>('SESSION_SECRET_KEY'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: SESSION_MAX_AGE,
        secure: IS_PROD,
        httpOnly: IS_PROD,
        sameSite: IS_PROD ? 'none' : 'lax',
      },
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(helmet());
  app.use(passport.initialize());
  app.use(passport.session());
  await databaseService.initialize();
  await app.listen(PORT);
}
bootstrap();
