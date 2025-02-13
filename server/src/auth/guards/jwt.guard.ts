import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { ACCESS_TOKEN_MAX_AGE, createCookieOptions } from 'src/utils';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const accessToken = request.cookies['accessToken'];

    const refreshToken = request.cookies['refreshToken'];

    if (!accessToken) {
      const newAccessToken = await this.authService.refreshToken(refreshToken);

      request.cookies['accessToken'] = newAccessToken;

      response.cookie(
        'accessToken',
        newAccessToken,
        createCookieOptions(ACCESS_TOKEN_MAX_AGE),
      );

      request.headers.authorization = `Bearer ${newAccessToken}`;

      return super.canActivate(context) as boolean;
    }
    request.headers.authorization = `Bearer ${accessToken}`;
    return super.canActivate(context) as boolean;
  }
}
