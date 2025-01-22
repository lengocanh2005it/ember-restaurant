import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import helmet from 'helmet';
import * as passport from 'passport';
import { DatabaseService } from 'src/database/database.service';
import { AppModule } from './app.module';
import { getEnvValue } from 'src/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);
  const configService = app.get(ConfigService);
  const databaseService = app.get(DatabaseService);
  const PORT = configService.get<number>('PORT_DEV');
  app.enableCors({
    origin: getEnvValue('ORIGINAL_FE_URL_PROD', 'ORIGINAL_FE_URL_DEV'),
    credentials: true,
    exposedHeaders: ['x-user-role', 'theme'],
  });
  app.use(
    session({
      name: 'user_session',
      secret: configService.get<string>('SESSION_SECRET_KEY'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 30,
        secure: configService.get<string>('NODE_ENV') === 'production',
        httpOnly: configService.get<string>('NODE_ENV') === 'production',
        sameSite:
          configService.get<string>('NODE_ENV') === 'production'
            ? 'none'
            : 'lax',
      },
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(cookieParser());
  app.use(helmet());
  app.use(passport.initialize());
  app.use(passport.session());
  await databaseService.initialize();
  await app.listen(PORT);
}
bootstrap();
