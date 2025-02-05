import {
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { getEnvValue } from 'src/utils';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly instance: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    const environment = configService.get<string>('NODE_ENV');

    if (!this.instance) {
      this.instance = createClient({
        socket: {
          host: getEnvValue('REDIS_HOST_PROD', 'REDIS_HOST_DEV'),
          port: +getEnvValue('REDIS_PORT_PROD', 'REDIS_PORT_DEV'),
        },
        ...(environment === 'production' && {
          username: configService.get<string>('REDIS_USERNAME'),
        }),
        ...(environment === 'production' && {
          password: configService.get<string>('REDIS_PASSWORD'),
        }),
      });

      this.instance.on('connect', () =>
        console.log(`🟢 Redis store connected.`),
      );
      this.instance.on('error', (err) =>
        console.error('🔴 Redis store is disconnected due to error: ', err),
      );
    }
  }

  async onModuleInit() {
    await this.instance.connect();
    console.log('✅ RedisService initialized.');
  }

  onModuleDestroy() {
    this.quit();
  }

  public getInstance = (): RedisClientType => {
    return this.instance;
  };

  public setKey = async (
    key: string,
    value: string,
    ttlInSeconds?: number,
  ): Promise<void> => {
    if (ttlInSeconds) {
      await this.instance.setEx(key, ttlInSeconds, value);
    } else {
      await this.instance.set(key, value);
    }
  };

  public getKey = async (key: string): Promise<any> => {
    return await this.instance.get(key);
  };

  public deleteKey = async (key: string): Promise<void> => {
    const data = await this.getKey(key);

    if (!data) throw new NotFoundException('Key not found.');

    await this.instance.del(key);
  };

  async quit(): Promise<void> {
    await this.instance.quit();
    console.log('🔴 Redis quit.');
  }
}
