import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import { Strategy } from 'passport-facebook';
import { AuthService } from 'src/auth/auth.service';
import { getEnvValue, UserFacebookData } from 'src/utils';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_APP_ID'),
      clientSecret: configService.get('FACEBOOK_APP_SECRET'),
      callbackURL: getEnvValue(
        'FACEBOOK_REDIRECT_URI_PROD',
        'FACEBOOK_REDIRECT_URI_DEV',
      ),
      profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
      scope: ['email'],
    });
  }

  async validate(accessToken: string): Promise<any> {
    const response = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`,
    );

    if (!response.data) throw new BadRequestException('Invalid accessToken.');

    const data = response.data as UserFacebookData;

    const { name, picture, id } = data;

    const facebookAccount = await this.authService.validateFacebookAccount({
      displayName: name,
      imageUrl: picture.url,
      socialId: id,
      provider: 'facebook',
    });

    if (!facebookAccount)
      throw new UnauthorizedException(
        'OAuth provider did not return user information.',
      );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { username, password, createdAt, updatedAt, ...res } =
      facebookAccount;

    return res;
  }
}
