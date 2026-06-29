import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {

    // Buscamos el usuario por email
    const user = await this.userRepository.findOne({ where: { email } });

    // Si no existe lanzamos error
    if (!user) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    // Comparamos la contraseña con el hash guardado en la BD
    const passwordValida = await bcrypt.compare(password, user.password);

    if (!passwordValida) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    // Creamos el token JWT con los datos básicos del usuario
    const payload = {
      id: user.id,
      email: user.email,
      permissions: user.permissions,
      department: user.department,
      position: user.position,
    };

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        permissions: user.permissions,
        department: user.department,
        position: user.position,
        ticketsEnabled: user.ticketsEnabled,
      }
    };
  }
}