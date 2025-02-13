import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/users/entities/users.entity';
import { getEnvValue, JwtPayload } from 'src/utils';
import { DataSource } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: getEnvValue('ORIGINAL_FE_URL_PROD', 'ORIGINAL_FE_URL_DEV'),
  },
})
export class PaymentGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  readonly server: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;

    if (!token) throw new UnauthorizedException('Access token is missing.');

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      }) as JwtPayload;

      const user = await this.dataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .where('user.id = :id', { id: decoded.userId })
        .getOne();

      if (!user) throw new NotFoundException('User Not Found.');

      client.data.user = user;

      console.log(
        `Client connected: ${client.id} with user: '${user?.name ? user.name : user.username}'`,
      );
    } catch (err: any) {
      console.error(err);
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user as User;

    console.log(
      `Client '${user?.name ? user.name : user.username}' disconnected: ${client.id}`,
    );
  }

  sendPaymentStatusUpdate(
    status: string,
    orderId?: string,
    reservationId?: string,
  ) {
    if (orderId) {
      this.server.emit('paymentStatusUpdate', { orderId, status });
    } else if (reservationId) {
      this.server.emit('paymentStatusUpdate', { reservationId, status });
    }
  }

  @SubscribeMessage('creatingPayment')
  handleCreatePaymentOfUser(
    client: Socket,
    data: { type: 'order' | 'reservation' },
  ) {
    const user = client.data.user;

    console.log(
      `User '${user?.name ? user.name : user.username}' making a payment for ${data.type}...`,
    );
  }
}
