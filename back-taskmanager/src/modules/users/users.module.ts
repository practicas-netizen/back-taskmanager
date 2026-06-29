/**
 * Módulo para gestionar empleados.
 *
 * Funciones principales:
 * 
 * 1. Registrar la entidad User en TypeORM para que 
 *    UsersService pueda utilizar su repositorio.
 * 
 * 2. Importar MailModule para que UsersService pueda 
 *    enviar notificaciones por correo al crear o editar empleados.
 * 
 * 3. Exportar UsersService para que AuthModule lo use en la 
 *    validación de credenciales durante el login.
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}