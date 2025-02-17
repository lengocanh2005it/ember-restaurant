import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserNotificationDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  readonly userId!: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  readonly notificationId!: string;
}
