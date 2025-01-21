import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_REDIRECT_URI'),
      scope: ['profile', 'email'],
      accessType: 'offline',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const payload = await this.authService.validateUserGoogle({
      email: profile.emails[0].value,
      displayName: profile.displayName,
      googleId: profile.id,
    });

    return {
      ...payload?.user,
      accessToken: payload?.accessToken,
      refreshToken: payload?.refreshToken,
    };
  }
}
