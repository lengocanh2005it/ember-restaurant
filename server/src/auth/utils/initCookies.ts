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
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60,
  });

  response.cookie('isLoggedIn', 'true', {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60,
  });

  response.cookie('theme', user.theme, {
    httpOnly: false,
    secure: true,
    maxAge: 1000 * 60 * 60,
  });

  method !== 'local'
    ? response.cookie('refreshToken', user.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60,
      })
    : response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60,
      });

  method !== 'local'
    ? response.cookie('accessToken', user.accessToken, {
        httpOnly: false,
        secure: true,
        maxAge: 1000 * 60 * 60,
      })
    : '';
};
