import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthPayloadDto } from 'src/auth/dtos/auth.dto';
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

  async validateUser({
    username,
    password,
  }: AuthPayloadDto): Promise<Record<string, string>> {
    const findUser = await this.usersService.handleFindUserByUsername(username);

    const isMatch = bcrypt.compareSync(password, findUser.password);

    if (!findUser || !isMatch)
      throw new UnauthorizedException('Username Or Password Is Incorrect.');

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

      const user = await this.usersService.handleFindUserBySocialId(
        'google_id',
        googleId,
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
    const user = await this.usersService.handleFindUserBySocialId(
      'facebook_id',
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
    const { userId } = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET_KEY'),
    });

    let user = null as User;

    if (userId) {
      user = await this.usersService.findOne(userId);
    }

    if (!user) throw new UnauthorizedException('Unauthenticated.');

    const payload = {
      userId: user.id,
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('ACCESS_TOKEN_LIFE'),
    });
  }

  async generateResetToken(email: string): Promise<string> {
    const payload = { email };
    return this.jwtService.sign(payload);
  }
}
