import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    console.log(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message || 'Internal Server Error!';

    if (exception instanceof BadRequestException) {
      if (message.includes('Google authentication failed')) {
        return response.redirect(
          this.configService.get<string>('GOOGLE_AUTH_FAILED_URI'),
        );
      } else if (message.includes('Facebook authentication failed')) {
        return response.redirect(
          this.configService.get<string>('FACEBOOK_AUTH_FAILED_URI'),
        );
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
