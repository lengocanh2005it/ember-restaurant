import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSupportTicketDto {
  @IsString()
  @IsNotEmpty()
  readonly original_request!: string;

  @IsString()
  @IsNotEmpty()
  readonly userId!: string;
}
