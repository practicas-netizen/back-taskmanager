/**
 * Este fichero muestra la lógica de negocio de los empleados.
 *
 * Funcionalidades:
 * 
 * 1. Se puede crear, listar, buscar, editar y eliminar usuarios (CRUD).
 * 
 * 2. Las contraseñas se convierten en un código antes de guardarse.
 * 
 * 3. Si el cargo es “RESPONSABLE CONTABLE", entonces no se permite que los tickets estén activados.
 * 
 * 4. removePassword: Elimina la contraseña de la respuesta antes de enviarla al usuario.
 * 
 * 5. INTEGRACIÓN DE EMAIL:
 *     · Al crear un empleado, se envia un correo de bienvenida con credenciales.
 *     · Al editar un empleado. se le envia un correo informando los cambios que ha habido en su perfil.
 * 
 * 6. Los empleados pueden cambiar su propia contraseña desde su perfil.
 *    Si la contraseña actual no coincide con la guardada, se devuelve un error.
 *    No se envía un correo electrónico cuando un empleado cambia su contraseña.
*/

import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

type UserResponse = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const exists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (exists) {
      throw new ConflictException('Ya existe un empleado con ese email');
    }

    const rawPassword = createUserDto.password;
    const password = await bcrypt.hash(rawPassword, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password,
      ticketsEnabled: createUserDto.ticketsEnabled ?? true,
    });

    const saved = await this.userRepository.save(user);

    await this.mailService.sendUserCreated(
      saved.email,
      `${saved.name} ${saved.lastName}`,
      rawPassword,
      saved.company,
      saved.position,
    );

    return this.removePassword(saved);
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.find({ order: { id: 'ASC' } });
    return users.map((user) => this.removePassword(user));
  }

  async findOne(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }
    return this.removePassword(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }

    const data = { ...updateUserDto };

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      delete data.password;
    }

    Object.assign(user, data);
    const saved = await this.userRepository.save(user);

    await this.mailService.sendUserUpdated(
      saved.email,
      `${saved.name} ${saved.lastName}`,
      saved.position,
      saved.department,
    );

    return this.removePassword(saved);
  }

  async changePassword(id: number, dto: ChangePasswordDto): Promise<{ message: string }> {
    // Necesitamos el password hasheado — findOne lo excluye, así que usamos el repositorio
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }

    // Verificar que la contraseña actual es correcta
    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) {
      throw new BadRequestException('La contrasenya actual no és correcta');
    }

    // Hashear y guardar la nueva contraseña
    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.save(user);

    return { message: 'Contrasenya canviada correctament' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }
    await this.userRepository.remove(user);
    return { message: 'Empleado eliminado correctamente' };
  }

  async getProfile(id: number): Promise<UserResponse> {
    return this.findOne(id);
  }

  private removePassword(user: User): UserResponse {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
