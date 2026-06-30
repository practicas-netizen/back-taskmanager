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

  async login(username: string, password: string) {

    // Buscamos el usuario por usuario
    const user = await this.userRepository.findOne({ where: { username } });

    // Si no existe lanzamos error
    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Comparamos la contraseña con el hash guardado en la BD
    const passwordValida = await bcrypt.compare(password, user.password);

    if (!passwordValida) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Creamos el token JWT con los datos básicos del usuario
    const payload = {
      id: user.id,
      username: user.username,
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
        username: user.username,
        permissions: user.permissions,
        department: user.department,
        position: user.position,
        ticketsEnabled: user.ticketsEnabled,
      }
    };
  }
}