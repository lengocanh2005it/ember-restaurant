import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { LocalLoginDto } from 'src/auth/dtos/auth.dto';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import {
  CreateSocialAccount,
  GenerateTokensType,
  initializeCookies,
  SESSION_MAX_AGE,
} from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateLocalAccount(localLoginDto: LocalLoginDto): Promise<User> {
    const { username, password } = localLoginDto;

    const findUser = await this.usersService.handleFindUserByField(
      'username',
      username,
    );

    const isMatch = bcrypt.compareSync(password, findUser.password);

    if (!findUser || !isMatch)
      throw new UnauthorizedException('Username Or Password is incorrect.');

    return findUser;
  }

  async validateGoogleAccount(
    createSocialAccount: CreateSocialAccount,
  ): Promise<User> {
    const { email } = createSocialAccount;

    const existingUserEmail = await this.usersService.handleFindUserByField(
      'email',
      email,
    );

    if (existingUserEmail) {
      const { google_id, facebook_id } = existingUserEmail;

      if (!google_id && !facebook_id)
        throw new BadRequestException('Google authentication failed.');

      return existingUserEmail;
    }

    return await this.usersService.handleCreateUserBySocialId(
      createSocialAccount,
    );
  }

  async validateFacebookAccount(
    createSocialAccount: CreateSocialAccount,
  ): Promise<User> {
    const { socialId } = createSocialAccount;

    let facebookAccount = await this.usersService.handleFindSocialAccount(
      'facebook_id',
      socialId,
    );

    if (!facebookAccount) {
      facebookAccount =
        await this.usersService.handleCreateUserBySocialId(createSocialAccount);
    }

    return facebookAccount;
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

  async generateResetToken(email: string): Promise<string> {
    const payload = { email };
    return this.jwtService.sign(payload);
  }

  public generateTokens = async (
    userId: string,
  ): Promise<GenerateTokensType> => {
    const createToken = (expiresIn: string) =>
      this.jwtService.sign({ userId }, { expiresIn });

    return {
      accessToken: createToken(this.configService.get('ACCESS_TOKEN_LIFE')),
      refreshToken: createToken(this.configService.get('REFRESH_TOKEN_LIFE')),
    };
  };

  public createSessionForUser = async (
    user: User,
    request: Request,
    login_method: 'local' | 'facebook' | 'google',
    response: Response,
  ): Promise<Record<string, string>> => {
    const { id } = user;

    const { accessToken, refreshToken } = await this.generateTokens(id);

    request.session.user = {
      userId: id,
      accessToken,
      refreshToken,
      role: user.roles.map((role) => role.name),
      login_method,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE),
    };

    initializeCookies(response, accessToken, refreshToken);

    return { accessToken, refreshToken, userId: id };
  };
}
