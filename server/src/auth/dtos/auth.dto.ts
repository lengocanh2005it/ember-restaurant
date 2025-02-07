import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LocalLoginDto {
  @IsString()
  @IsNotEmpty()
  readonly username!: string;

  @IsString()
  @IsNotEmpty()
  readonly password!: string;
}

export class SocialLoginDto {
  @IsOptional()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsOptional()
  readonly image?: string;

  @IsString()
  @IsNotEmpty()
  readonly subId!: string;

  @IsString()
  @IsNotEmpty()
  readonly provider!: string;
}

export class CreateSessionDto {
  @IsOptional()
  readonly userId?: string;

  @IsOptional()
  readonly accessToken?: string;

  @IsOptional()
  readonly refreshToken?: string;
}
