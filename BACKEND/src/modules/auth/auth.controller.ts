import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsUsername, IsString, IsNotEmpty } from 'class-validator';
import { AuthService } from './auth.service';

class LoginDto {
  @ApiProperty({ example: 'jordi.test@empresa.com' })
  @IsUsername()
  username: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDto })
  login(@Body() body: LoginDto) {
    return this.authService.login(body.username, body.password);
  }
}


