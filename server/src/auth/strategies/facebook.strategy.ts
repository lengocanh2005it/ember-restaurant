import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_APP_ID'),
      clientSecret: configService.get('FACEBOOK_APP_SECRET'),
      callbackURL: configService.get('FACEBOOK_REDIRECT_URI'),
      scope: ['email', 'public_profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const payload = await this.authService.validateUserFacebook({
      facebookId: profile.id,
      email:
        profile?.emails?.map((email) => email.value).join(',') ??
        'user123@gmail.com',
      displayName: profile.displayName,
    });

    return {
      ...payload.user,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    };
  }
}
