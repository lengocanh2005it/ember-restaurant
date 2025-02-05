import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserSession = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return data ? request.session.user[data] : request.session.user;
  },
);
