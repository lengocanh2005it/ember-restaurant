import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSupportTicketDto {
  @IsString()
  @IsNotEmpty()
  readonly original_request!: string;

  @IsString()
  @IsNotEmpty()
  readonly userId!: string;

  @IsOptional()
  readonly status?: string;

  @IsOptional()
  readonly response?: string;
}
