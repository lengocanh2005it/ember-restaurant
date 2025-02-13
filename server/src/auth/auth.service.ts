import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as cookieSignature from 'cookie-signature';
import { Request, Response } from 'express';
import { LocalLoginDto } from 'src/auth/dtos/auth.dto';
import { RedisService } from 'src/redis/redis.service';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import {
  CreateSocialAccount,
  GenerateTokensType,
  initializeCookies,
  JwtPayload,
  SESSION_MAX_AGE,
  SessionDataRedisType,
  UserSessionData,
} from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
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
    if (!token) throw new UnauthorizedException('Session is expired.');

    const { userId } = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
    }) as JwtPayload;

    if (!userId)
      throw new UnauthorizedException('UserId not found in Jwt Payload.');

    const user = await this.usersService.findOne(userId);

    if (!user) throw new NotFoundException('User Not Found.');

    const payload = {
      userId: user.id,
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('ACCESS_TOKEN_LIFE'),
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async generateResetToken(email: string): Promise<string> {
    const payload = { email };

    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('ACCESS_TOKEN_LIFE'),
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  public generateTokens = async (
    userId: string,
  ): Promise<GenerateTokensType> => {
    const createToken = (expiresIn: string) =>
      this.jwtService.sign(
        { userId },
        { expiresIn, secret: this.configService.get<string>('JWT_SECRET_KEY') },
      );

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
      roles: user.roles.map((role) => role.name),
      login_method,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE),
      ...(user.username ? { username: user.username } : {}),
    };

    initializeCookies(response, accessToken, refreshToken);

    return { accessToken, refreshToken, userId: id };
  };

  public handleGetSessionFromSessionID = async (
    decodedSessionID: string,
  ): Promise<UserSessionData> => {
    const unsignedSessionID = cookieSignature.unsign(
      decodedSessionID.slice(2),
      this.configService.get<string>('SESSION_SECRET_KEY') || '',
    );

    const cachedData = await this.redisService.getKey(
      `sess:${unsignedSessionID}`,
    );

    const data = JSON.parse(cachedData) as SessionDataRedisType;

    return data.user;
  };
}
