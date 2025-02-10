import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<Partial<User>> {
    const user = await this.authService.validateLocalAccount({
      username,
      password,
    });

    if (!user) throw new UnauthorizedException('Unauthenticated.');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, createdAt, updatedAt, ...res } = user;

    return res;
  }
}
