import { ConfigService } from '@nestjs/config';

export const initCookies = (
  response: any,
  user: any,
  role: string,
  method: string,
  configService: ConfigService,
  refreshToken?: string,
) => {
  response.cookie('role', role, {
    httpOnly: configService.get<string>('NODE_ENV') === 'production',
    secure: configService.get<string>('NODE_ENV') === 'production',
    maxAge: 1000 * 60 * 30,
    sameSite:
      configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
  });

  response.cookie('isLoggedIn', 'true', {
    httpOnly: configService.get<string>('NODE_ENV') === 'production',
    secure: configService.get<string>('NODE_ENV') === 'production',
    maxAge: 1000 * 60 * 30,
    sameSite:
      configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
  });

  response.cookie('theme', user.theme, {
    httpOnly: configService.get<string>('NODE_ENV') === 'production',
    secure: configService.get<string>('NODE_ENV') === 'production',
    maxAge: 1000 * 60 * 30,
    sameSite:
      configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
  });

  response.cookie(
    'refreshToken',
    method !== 'local' ? user.refreshToken : refreshToken,
    {
      httpOnly: configService.get<string>('NODE_ENV') === 'production',
      secure: configService.get<string>('NODE_ENV') === 'production',
      maxAge: 1000 * 60 * 30,
      sameSite:
        configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
    },
  );

  if (method !== 'local') {
    response.cookie('accessToken', user.accessToken, {
      httpOnly: configService.get<string>('NODE_ENV') === 'production',
      secure: configService.get<string>('NODE_ENV') === 'production',
      maxAge: 1000 * 60 * 2,
      sameSite:
        configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
    });
  }
};
