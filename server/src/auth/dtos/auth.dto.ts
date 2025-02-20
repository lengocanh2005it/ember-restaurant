import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

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

export class Confirm2FADto {
  @IsString()
  @IsNotEmpty()
  @Length(6)
  readonly otp!: string;

  @IsString()
  @IsEmail()
  readonly email!: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  readonly password!: string;

  @IsString()
  @IsNotEmpty()
  readonly newPassword!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  readonly otp!: string;
}
