import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsUsername,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../users.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Jordi' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Garcia' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ example: 'jmora' })
  @IsUsername()
  username!: string;

  @ApiProperty({ example: 'jordi@empresa.com' })
  @IsEmail({}, { message: 'El correo electronico debe ser valido' })
  email?: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6, { message: 'La contrasena debe tener minimo 6 caracteres' })
  password!: string;

  @ApiProperty({ example: '2000-01-01' })
  @IsDateString()
  birthDate?: string;

  @ApiProperty({ example: 'Koral Descanso' })
  @IsString()
  @IsNotEmpty()
  company!: string;

  @ApiProperty({ example: 'Barcelona' })
  @IsString()
  @IsNotEmpty()
  workCenter!: string;

  @ApiProperty({ example: 'Contabilidad' })
  @IsString()
  @IsNotEmpty()
  department!: string;

  @ApiProperty({ example: 'Tecnico administrativo' })
  @IsString()
  @IsNotEmpty()
  position!: string;

  @ApiProperty({ example: [UserRole.EMPLOYEE], enum: UserRole, isArray: true })
  @IsArray()
  @IsEnum(UserRole, { each: true })
  permissions!: UserRole[];
  
  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  ticketsEnabled?: boolean;

}
