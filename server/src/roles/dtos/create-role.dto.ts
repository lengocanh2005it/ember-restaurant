import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreatePermissionDto } from 'src/permissions/dtos/create-permission.dto';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  readonly permissions?: CreatePermissionDto[];
}
