import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import helmet from 'helmet';
import * as passport from 'passport';
import { DatabaseService } from 'src/database/database.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);
  const configService = app.get(ConfigService);
  const databaseService = app.get(DatabaseService);
  const PORT = configService.get<number>('PORT') || 3001;
  app.enableCors({
    origin: configService.get<string>('ORIGINAL_FE_URL'),
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
        maxAge: 1000 * 60 * 60,
        secure: true,
        httpOnly: true,
        sameSite: 'none',
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
