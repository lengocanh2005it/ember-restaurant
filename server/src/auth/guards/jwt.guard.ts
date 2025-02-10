import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const accessToken = request.cookies['accessToken'];

    const refreshToken = request.cookies['refreshToken'];

    if (!accessToken && !refreshToken)
      throw new UnauthorizedException('Tokens are missing...');

    try {
      this.jwtService.verify(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });

      request.headers.authorization = `Bearer ${accessToken}`;

      return super.canActivate(context) as boolean;
    } catch (err: any) {
      if (refreshToken) {
        try {
          const newAccessToken =
            await this.authService.refreshToken(refreshToken);

          request.headers.authorization = `Bearer ${newAccessToken}`;

          request.cookies['accessToken'] = newAccessToken;

          return super.canActivate(context) as boolean;
        } catch (err) {
          console.error(err);

          throw new UnauthorizedException(
            'Both accessToken and refreshToken are invalid or expired.',
          );
        }
      }

      console.error(err);

      throw new UnauthorizedException(
        'Access token expired and no refresh token provided.',
      );
    }
  }
}
