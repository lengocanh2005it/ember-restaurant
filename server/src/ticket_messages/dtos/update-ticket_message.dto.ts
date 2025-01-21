import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateTicketMessageDto {
  @IsString()
  @IsNotEmpty()
  readonly message!: string;

  @IsString()
  @IsIn(['user', 'admin'])
  @IsNotEmpty()
  readonly sender_type!: string;

  @IsString()
  @IsNotEmpty()
  readonly supportTicketId!: string;

  @IsString()
  @IsNotEmpty()
  readonly senderId!: string;
}
