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
import { SocialLoginDto } from 'src/auth/dtos/auth.dto';
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
  SessionData,
  Theme,
  encodePassword,
  generateVerificationCode,
  getDataOfSessionFromRequest,
  initializeCookies,
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

  @Get('role')
  @SkipThrottle()
  async handleAuthRole(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    if (req.cookies && req.cookies['role']) {
      res.setHeader('x-user-role', req.cookies['role']);
    }
    if (req.cookies && req.cookies['theme']) {
      if (req.cookies['theme'] === 'dark') {
        res.setHeader('theme', 'dark');
      } else {
        res.setHeader('theme', 'light');
      }
    }
    return res.sendStatus(200);
  }

  @Post('social/login')
  async handleSocialLogin(
    @Req() req: any,
    @Body() socialLoginDto: SocialLoginDto,
  ): Promise<any> {
    const { accessToken, refreshToken, userId } =
      await this.authService.handleSocialLogin(socialLoginDto);

    return { accessToken, userId, refreshToken, sessionID: req.sessionID };
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: any, @Res() res: Response): Promise<void> {
    const { userId, refreshToken, accessToken } = req.user as SessionData;

    if (!refreshToken || !accessToken)
      throw new UnauthorizedException('Tokens not found.');

    req.session.user = {
      userId,
      accessToken,
      refreshToken,
    };

    const user = await this.usersService.findOne(userId);

    if (user.username === this.configService.get<string>('ADMIN_NAME')) {
      initializeCookies(
        res,
        user,
        'admin',
        'local',
        this.configService,
        refreshToken,
      );
    } else {
      initializeCookies(
        res,
        user,
        'user',
        'local',
        this.configService,
        refreshToken,
      );
    }

    res.status(201).json({
      statusCode: 201,
      message: 'Logged in successfully!',
      data: { accessToken, userId, refreshToken, sessionID: req.sessionID },
    });
  }

  @Post('logout')
  async logout(@Res() res: Response): Promise<void> {
    const cookies = [
      { name: 'isLoggedIn', httpOnly: true, secure: true },
      { name: 'refreshToken', httpOnly: true, secure: true },
      { name: 'user_session', httpOnly: true, secure: true },
      { name: 'role', httpOnly: true, secure: true },
      { name: 'theme', httpOnly: true, secure: false },
      { name: 'accessToken', httpOnly: false, secure: false },
    ];

    cookies.forEach(({ name, httpOnly, secure }) => {
      res.cookie(name, '', { httpOnly, secure, maxAge: 0 });
    });

    res.status(200).json({
      statusCode: 200,
      message: 'Logged out successfully!',
    });
  }

  @Post('refresh')
  async handleRefreshToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      throw new UnauthorizedException(
        'Authentication failed: Refresh token is missing.',
      );

    const accessToken = await this.authService.refreshToken(refreshToken);

    res.status(201).json({
      statusCode: 201,
      message: 'Refresh token successfully!',
      data: { accessToken },
    });
  }

  @SkipThrottle()
  @Post('theme')
  async handleSwitchTheme(
    @Res() res: Response,
    @Body() themePayload: Theme,
    @Req() request: any,
  ): Promise<void> {
    const data = await getDataOfSessionFromRequest(
      request,
      this.configService,
      this.redisService,
    );

    const userId = data.userId;

    const { theme } = themePayload;

    if (theme === 'light') {
      res.cookie('theme', 'light', {
        httpOnly: false,
        secure: true,
        maxAge: 1000 * 60 * 60,
      });
    } else {
      res.cookie('theme', 'dark', {
        httpOnly: false,
        secure: true,
        maxAge: 1000 * 60 * 60,
      });
    }

    await this.usersService.handleUpdateThemeOfUser(userId, theme);

    res.json({
      statusCode: 201,
      message: 'Updated theme successfully.',
    });
  }

  @Get('profile')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  async getProfile(
    @Req() request: any,
    @Res() response: Response,
  ): Promise<any> {
    const sessionId = request.cookies['user_session'];

    if (!sessionId) {
      const user = request.user as User;

      const { id } = user;

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

      request.session.user = { userId: id, accessToken, refreshToken };

      const { sessionID } = request;

      this.authService.setSessionCookies(response, sessionID, accessToken);

      return response.status(200).json({ data: user });
    }

    const data = await getDataOfSessionFromRequest(
      request,
      this.configService,
      this.redisService,
    );

    const userId = data.userId;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, updatedAt, ...res } =
      await this.usersService.findOne(userId);

    return response.status(200).json({ data: res });
  }

  @Post('request/reset-password')
  async handleRequestResetPassword(
    @Body('email') email: string,
  ): Promise<void> {
    const token = await this.authService.generateResetToken(email);

    await this.emailsService.sendResetEmail(email, token);
  }

  @Post('reset-password')
  async handleResetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<void> {
    const decoded = await this.jwtService.verify(token);

    const hashedPassword = encodePassword(newPassword);

    await this.usersService.handleUpdatePassword(decoded.email, hashedPassword);
  }

  @Post('update-email')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async updateEmail(
    @Body('email') email: string,
    @Body('userId') userId: string,
    @Query() queries: Record<string, string>,
  ): Promise<Record<string, string | number>> {
    const user = await this.usersService.handleFindUserByEmail(email);

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
