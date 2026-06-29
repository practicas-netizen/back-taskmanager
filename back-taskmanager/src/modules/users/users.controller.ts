/**
 * Lógica de negocio de los empleados.
 * 
 * Funcionalidad:
 * Endpoints REST del módulo de empleados están bajo /api/users.
 *
 * Rutas:
 * - POST   /api/users                    → crear empleado (ADMIN)
 * - GET    /api/users                    → listar todos los empleados (ADMIN)
 * - GET    /api/users/profile/:id        → perfil de un empleado concreto
 * - GET    /api/users/:id                → datos de un empleado por id
 * - PATCH  /api/users/:id                → editar datos de un empleado (ADMIN)
 * - PATCH  /api/users/:id/password       → cambiar contraseña (propio empleado)
 * - DELETE /api/users/:id                → eliminar empleado (ADMIN)
 *
 * Es importante tener en cuenta que /api/users/profile/:id debe 
 * estar antes de /api/users/:id para evitar que se interprete “profile” 
 * como un id numérico. Lo mismo aplica a /:id/password, debe ir antes de rutas más genéricas.
*/

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo empleado' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los empleados' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile/:id')
  @ApiOperation({ summary: 'Obtener perfil de un empleado' })
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(+id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener empleado por ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar datos de un empleado' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Cambiar contraseña del empleado desde su perfil' })
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(+id, changePasswordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar empleado' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}