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
import * as QRCode from 'qrcode';
import * as speakeasy from 'speakeasy';
import {
  Confirm2FADto,
  LocalLoginDto,
  UpdatePasswordDto,
} from 'src/auth/dtos/auth.dto';
import { EmailsService } from 'src/emails/emails.service';
import { RedisService } from 'src/redis/redis.service';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import {
  CreateSocialAccount,
  GenerateTokensType,
  generateVerificationCode,
  handleDecryptSecret,
  handleEncryptSecret,
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
    private readonly emailsService: EmailsService,
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
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async generateResetToken(email: string): Promise<string> {
    const payload = { email };

    return this.jwtService.sign(payload, {
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

  public handleVerify2FA = async (
    otp: string,
    userId: string,
  ): Promise<User> => {
    const { two_factor_secret, encrypted_iv } =
      await this.usersService.handleGetSecretAndIvEncryptedOfUser(userId);

    const secret = handleDecryptSecret(two_factor_secret, encrypted_iv);

    const isValid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: otp,
      window: 1,
    });

    if (!isValid)
      throw new BadRequestException(
        'Your OTP is not correct. Please try again.',
      );

    await this.usersService.handleUpdate2FAEnableForUser(userId);

    return await this.usersService.findOne(userId);
  };

  public handleGenerate2FA = async (
    user: User,
    type: string,
  ): Promise<Record<string, string | User>> => {
    if (type === 'generate') {
      const secret = speakeasy.generateSecret({
        length: 20,
        name: `Ember Restaurant: ${user.username ?? user.name}`,
      });

      const { encryptedData, iv } = handleEncryptSecret(secret.base32);

      await this.usersService.handleUpdate2FAOfUser(user.id, encryptedData, iv);

      const qrCodeImage = await QRCode.toDataURL(secret.otpauth_url);

      return {
        qrCodeImage,
      };
    } else if (type === 'cancel') {
      await this.usersService.handleCancel2FAOfUser(user.id);

      return {
        profile: await this.usersService.findOne(user.id),
      };
    }
  };

  public handleConfirm2FA = async (
    userId: string,
    confirm2FADto: Confirm2FADto,
  ) => {
    const { otp, email } = confirm2FADto;

    const userWithEmail = await this.usersService.handleFindUserByField(
      'email',
      email,
    );

    if (userWithEmail && userWithEmail.id !== userId)
      throw new BadRequestException(
        'This email has already been registered with an account in the system. Please choose a different email.',
      );

    const isValidVerificationCode =
      await this.emailsService.handleVerifyVerificationCode(
        otp,
        email,
        'verify',
      );

    if (!isValidVerificationCode)
      throw new NotFoundException(
        'Incorrect OTP or verification code has expired.',
      );

    await this.usersService.handleUpdateEmailOfUser(userId, email);

    return {
      success: true,
    };
  };

  public handleSendOTPToEmail = async (
    email: string,
  ): Promise<Record<string, string>> => {
    const verificationCode = generateVerificationCode();

    await this.emailsService.sendVerificationCode(email, verificationCode);

    return {
      message: 'OTP has been sent to this email.',
    };
  };

  public handleUpdatePassword = async (
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<Record<string, string>> => {
    const { otp, password, newPassword } = updatePasswordDto;

    const { encrypted_iv, two_factor_secret } =
      await this.usersService.handleGetSecretAndIvEncryptedOfUser(userId);

    const secret = handleDecryptSecret(two_factor_secret, encrypted_iv);

    const isValidOTP = speakeasy.totp.verify({
      secret,
      window: 1,
      token: otp,
      encoding: 'base32',
    });

    if (!isValidOTP)
      throw new BadRequestException(
        'OTP is incorrect or expired. Please try again.',
      );

    await this.usersService.handleUpdatePasswordOfUser(
      userId,
      password,
      newPassword,
    );

    return { msg: 'Password updated successfully.' };
  };
}
