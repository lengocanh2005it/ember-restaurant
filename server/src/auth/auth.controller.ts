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
import { FacebookAuthGuard } from 'src/auth/guards/facebook.guard';
import { GoogleAuthGuard } from 'src/auth/guards/google.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { EmailsService } from 'src/emails/emails.service';
import { RedisService } from 'src/redis/redis.service';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { UsersService } from 'src/users/users.service';
import {
  ACCESS_TOKEN_MAX_AGE,
  IS_PROD,
  Theme,
  createCookieOptions,
  encodePassword,
  generateVerificationCode,
  getDataOfSessionFromRequest,
  getEnvValue,
} from 'src/utils';

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
    const cookies = [
      { name: 'isLoggedIn', httpOnly: IS_PROD, secure: IS_PROD },
      { name: 'refreshToken', httpOnly: IS_PROD, secure: IS_PROD },
      { name: 'user_session', httpOnly: IS_PROD, secure: IS_PROD },
      { name: 'accessToken', httpOnly: IS_PROD, secure: IS_PROD },
    ];

    cookies.forEach(({ name, httpOnly, secure }) => {
      res.cookie(name, '', {
        httpOnly,
        secure,
        maxAge: 0,
        sameSite: IS_PROD ? 'none' : 'lax',
      });
    });

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

  @SkipThrottle()
  @Post('theme')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async handleSwitchTheme(
    @Body() themePayload: Theme,
    @Req() request: Request,
  ): Promise<void> {
    const data = await getDataOfSessionFromRequest(
      request,
      this.configService,
      this.redisService,
    );

    const userId = data.userId;

    const { theme } = themePayload;

    await this.usersService.handleUpdateThemeOfUser(userId, theme);
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, updatedAt, ...res } =
      await this.usersService.findOne(user.id);

    return response.status(200).json({
      statusCode: 200,
      message: 'Get profile of user successfully.',
      data: res,
    });
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
    const decoded = await this.jwtService.verify(token);

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
    const code = await this.emailsService.findOneByCode(
      verificationCode,
      newEmail,
    );

    if (!code) throw new BadRequestException('Verify failed!');

    return { msg: 'Verify successfully!' };
  }
}
