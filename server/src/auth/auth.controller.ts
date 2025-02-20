import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SkipThrottle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { Confirm2FADto, UpdatePasswordDto } from 'src/auth/dtos/auth.dto';
import { FacebookAuthGuard } from 'src/auth/guards/facebook.guard';
import { GoogleAuthGuard } from 'src/auth/guards/google.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { EmailsService } from 'src/emails/emails.service';
import { RedisService } from 'src/redis/redis.service';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import {
  ACCESS_TOKEN_MAX_AGE,
  Theme,
  UserSessionData,
  createCookieOptions,
  encodePassword,
  generateVerificationCode,
  getEnvValue,
  resetCookies,
} from 'src/utils';
import { UserSession } from 'src/utils/common/decorators/user-session.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly emailsService: EmailsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async handleGoogleLogin(): Promise<void> {
    console.log('Redirecting user to Google for authentication...');
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleGoogleRedirect(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const user = request.user;

    await this.authService.createSessionForUser(
      user,
      request,
      'google',
      response,
    );

    return response.redirect(
      `${getEnvValue('ORIGINAL_FE_URL_PROD', 'ORIGINAL_FE_URL_DEV')}/home`,
    );
  }

  @Get('facebook/login')
  @UseGuards(FacebookAuthGuard)
  async handleFacebookLogin(): Promise<void> {
    console.log('Redirecting user to Facebook for authentication...');
  }

  @Get('facebook/redirect')
  @UseGuards(FacebookAuthGuard)
  async handleFacebookRedirect(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const user = request.user;

    await this.authService.createSessionForUser(
      user,
      request,
      'google',
      response,
    );

    return response.redirect(
      `${getEnvValue('ORIGINAL_FE_URL_PROD', 'ORIGINAL_FE_URL_DEV')}/home`,
    );
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const user = req.user;

    const { accessToken } = await this.authService.createSessionForUser(
      user,
      req,
      'local',
      res,
    );

    return res.status(201).json({
      statusCode: 201,
      message: 'Logged in successfully!',
      data: {
        accessToken,
      },
    });
  }

  @Post('logout')
  async logout(
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    resetCookies(res);

    return res.status(200).json({
      statusCode: 200,
      message: 'Logged out successfully!',
    });
  }

  @Post('refresh')
  async handleRefreshToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken)
      throw new UnauthorizedException(
        'Authentication failed: Refresh token is missing.',
      );

    const accessToken = await this.authService.refreshToken(refreshToken);

    res.cookie(
      'accessToken',
      accessToken,
      createCookieOptions(ACCESS_TOKEN_MAX_AGE),
    );

    return res.status(201).json({
      statusCode: 201,
      message: 'Refresh token successfully!',
      data: { accessToken },
    });
  }

  @Post('theme')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async handleSwitchTheme(
    @Body() themePayload: Theme,
    @UserSession() session: UserSessionData,
  ): Promise<Partial<User>> {
    if (!session) throw new UnauthorizedException('User Not Authenticated.');

    const { userId } = session;

    const { theme } = themePayload;

    await this.usersService.handleUpdateThemeOfUser(userId, theme);

    return await this.usersService.findOne(userId);
  }

  @Get('profile')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const user = request.user;

    if (!user) throw new UnauthorizedException('User Not Authenticated.');

    return response.status(200).json({
      statusCode: 200,
      message: 'Get profile of user successfully.',
      data: await this.usersService.findOne(user.id),
    });
  }

  @Get('session')
  async getSessionBySessionID(
    @Query('sessionId') sessionId: string,
  ): Promise<UserSessionData> {
    const decodedSessionID = decodeURIComponent(sessionId);

    return await this.authService.handleGetSessionFromSessionID(
      decodedSessionID,
    );
  }

  @Post('request/reset-password')
  async handleRequestResetPassword(
    @Body('email') email: string,
  ): Promise<void> {
    const token = await this.authService.generateResetToken(email);

    return await this.emailsService.sendResetEmail(email, token);
  }

  @Post('reset-password')
  async handleResetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<void> {
    const decoded = await this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
    });

    const hashedPassword = encodePassword(newPassword);

    return await this.usersService.handleUpdatePassword(
      decoded.email,
      hashedPassword,
    );
  }

  @Post('update-email')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async updateEmail(
    @Body('email') email: string,
    @Body('userId') userId: string,
    @Query() queries: Record<string, string>,
  ): Promise<Record<string, string | number>> {
    const user = await this.usersService.handleFindUserByField('email', email);

    if (queries && queries.options === 'check') {
      if (user && user.id !== userId) {
        return {
          statusCode: 400,
        };
      }
      return {
        statusCode: 201,
      };
    }

    const randomVerificationCode = generateVerificationCode();

    if (!user) {
      await this.emailsService.sendVerificationCode(
        email,
        randomVerificationCode,
      );
      return {
        statusCode: 201,
      };
    } else if (user.id !== userId)
      throw new BadRequestException(
        'This email has already been used by another user!',
      );
    return {
      statusCode: 200,
    };
  }

  @Post('verify-email')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async verifyEmail(
    @Body('verificationCode') verificationCode: string,
    @Body('newEmail') newEmail: string,
  ): Promise<Record<string, string | number>> {
    const isValidVerificationCode =
      await this.emailsService.handleVerifyVerificationCode(
        verificationCode,
        newEmail,
        'verify',
      );

    if (!isValidVerificationCode)
      throw new BadRequestException(
        'Verify failed due to expired verification code!',
      );

    return { msg: 'Verify successfully!' };
  }

  @Post('2fa')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async handleGenerate2FA(
    @Req() request: Request,
    @Body('type') type: string,
  ): Promise<Record<string, User | string>> {
    return await this.authService.handleGenerate2FA(request.user, type);
  }

  @Post('verify/2fa')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async handleVerify2FA(
    @Req() request: Request,
    @Body('otp') otp: string,
  ): Promise<User> {
    return await this.authService.handleVerify2FA(otp, request.user.id);
  }

  @Post('confirm/2fa')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async handleConfirmGenerate2FA(
    @Req() request: Request,
    @Body() confirm2FaDto: Confirm2FADto,
  ) {
    return await this.authService.handleConfirm2FA(
      request.user.id,
      confirm2FaDto,
    );
  }

  @Post('otp')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async handleSendOTPToEmail(
    @Body('email') email: string,
  ): Promise<Record<string, string>> {
    return await this.authService.handleSendOTPToEmail(email);
  }

  @Post('update-password')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async handleUpdatePassword(
    @Req() request: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<Record<string, string>> {
    return await this.authService.handleUpdatePassword(
      request.user.id,
      updatePasswordDto,
    );
  }
}
