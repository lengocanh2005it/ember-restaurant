import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from 'src/auth/auth.service';
import { getEnvValue, UserGoogleData } from 'src/utils';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: getEnvValue(
        'GOOGLE_REDIRECT_URI_PROD',
        'GOOGLE_REDIRECT_URI_DEV',
      ),
      scope: ['profile', 'email'],
      accessType: 'offline',
    });
  }

  async validate(accessToken: string) {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
    );

    if (!response.data) throw new BadRequestException('Invalid accessToken.');

    const data = response.data as UserGoogleData;

    const { email, email_verified, name, picture, sub } = data;

    const googleAccount = await this.authService.validateGoogleAccount({
      ...(email_verified === true && { email }),
      displayName: name,
      imageUrl: picture,
      socialId: sub,
      provider: 'google',
    });

    if (!googleAccount)
      throw new UnauthorizedException(
        'OAuth provider did not return user information.',
      );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { username, password, createdAt, updatedAt, ...res } = googleAccount;

    return res;
  }
}
