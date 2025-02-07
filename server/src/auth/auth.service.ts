import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CookieOptions, Response } from 'express';
import { LocalLoginDto, SocialLoginDto } from 'src/auth/dtos/auth.dto';
import { RolesService } from 'src/roles/roles.service';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { UserFacebookDetails, UserGoogleDetails } from 'src/utils';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly roleService: RolesService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    localLoginDto: LocalLoginDto,
  ): Promise<Record<string, string>> {
    const { username, password } = localLoginDto;

    const findUser = await this.usersService.handleFindUserByUsername(username);

    const isMatch = bcrypt.compareSync(password, findUser.password);

    if (!findUser || !isMatch)
      throw new UnauthorizedException('Username Or Password is incorrect.');

    const { id } = findUser;

    const accessToken = this.jwtService.sign(
      { userId: id },
      {
        expiresIn: this.configService.get('ACCESS_TOKEN_LIFE'),
      },
    );

    const refreshToken = this.jwtService.sign(
      { userId: id },
      {
        expiresIn: this.configService.get('REFRESH_TOKEN_LIFE'),
      },
    );

    return {
      accessToken,
      refreshToken,
      userId: id,
    };
  }

  async validateUserGoogle(details: UserGoogleDetails): Promise<any> {
    const { googleId, displayName, email } = details;

    const existingEmail = await this.usersService.handleFindUserByEmail(email);

    if (existingEmail) {
      if (!existingEmail.google_id)
        throw new BadRequestException('Google authentication failed');

      const user = await this.usersService.handleVerifySocialUser(
        'google',
        googleId,
        email,
      );

      const payload = { userId: user.id };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('ACCESS_TOKEN_LIFE'),
      });

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('REFRESH_TOKEN_LIFE'),
      });

      return { user, accessToken, refreshToken };
    } else {
      const newUser = await this.usersService.handleCreateUserBySocialId(
        'google_id',
        googleId,
        displayName,
        email,
      );

      const role = await this.roleService.findRoleByName('user');

      await this.dataSource
        .createQueryBuilder()
        .relation(User, 'roles')
        .of(newUser.id)
        .add(role.id);

      const payload = {
        userId: newUser.id,
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('ACCESS_TOKEN_LIFE'),
      });

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('REFRESH_TOKEN_LIFE'),
      });

      return {
        user: newUser,
        accessToken,
        refreshToken,
      };
    }
  }

  async validateUserFacebook(
    details: UserFacebookDetails,
  ): Promise<Record<string, any>> {
    const { facebookId, email, displayName } = details;
    const user = await this.usersService.handleVerifySocialUser(
      'facebook',
      details.facebookId,
    );

    if (user) {
      const payload = { userId: user.id };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('ACCESS_TOKEN_LIFE'),
      });

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('REFRESH_TOKEN_LIFE'),
      });

      return {
        user,
        accessToken,
        refreshToken,
      };
    }

    const newUser = await this.usersService.handleCreateUserBySocialId(
      'facebook_id',
      facebookId,
      displayName,
      email,
    );

    const role = await this.roleService.findRoleByName('user');

    await this.dataSource
      .createQueryBuilder()
      .relation(User, 'roles')
      .of(newUser.id)
      .add(role.id);

    const payload = {
      userId: newUser.id,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('ACCESS_TOKEN_LIFE'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('REFRESH_TOKEN_LIFE'),
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string): Promise<string> {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });

      if (!userId)
        throw new UnauthorizedException('UserId not found in Jwt Payload.');

      const user = await this.usersService.findOne(userId);

      if (!user) throw new NotFoundException('User Not Found.');

      const payload = {
        userId: user.id,
      };

      return this.jwtService.sign(payload, {
        expiresIn: this.configService.get('ACCESS_TOKEN_LIFE'),
      });
    } catch (err: any) {
      if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Refresh token expired.');
      } else {
        throw new UnauthorizedException('Invalid refresh token.');
      }
    }
  }

  public handleSocialLogin = async (
    socialLoginDto: SocialLoginDto,
  ): Promise<any> => {
    const { email, subId, provider } = socialLoginDto;

    const user =
      (email &&
        (await this.usersService.handleVerifySocialUser(
          provider as 'google' | 'facebook',
          subId,
          email,
        ))) ||
      (await this.usersService.handleLoginSocialUser(socialLoginDto));

    const generateToken = (expiresIn: string) =>
      this.jwtService.sign({ userId: user.id }, { expiresIn });

    return {
      accessToken: generateToken(
        this.configService.get<string>('ACCESS_TOKEN_LIFE'),
      ),
      refreshToken: generateToken(
        this.configService.get<string>('REFRESH_TOKEN_LIFE'),
      ),
      userId: user.id,
    };
  };

  async generateResetToken(email: string): Promise<string> {
    const payload = { email };
    return this.jwtService.sign(payload);
  }

  public setSessionCookies(
    res: Response,
    sessionID: string,
    accessToken: string,
  ) {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';

    const sessionOptions: CookieOptions = {
      httpOnly: true,
      secure: isProd,
      maxAge: 1000 * 60 * 30,
      sameSite: isProd ? 'none' : 'lax',
    };

    const accessTokenOptions: CookieOptions = {
      httpOnly: false,
      secure: isProd,
      maxAge: 1000 * 60 * 30,
      sameSite: isProd ? 'none' : 'lax',
    };

    res.cookie('user_session', sessionID, sessionOptions);
    res.cookie('accessToken', accessToken, accessTokenOptions);
  }
}
