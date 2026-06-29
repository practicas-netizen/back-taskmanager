import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/users.enum';
import { CreateTicketResponseDto } from './dto/create-ticket-response.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { TicketResponse } from './entities/ticket-response.entity';
import { Ticket } from './entities/ticket.entity';
import { TicketStatus } from './tickets.enum';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketResponse)
    private readonly ticketResponseRepository: Repository<TicketResponse>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async findUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Empleado no encontrado');
    }

    return user;
  }

  private userHasRole(user: User, role: UserRole): boolean {
    return user.permissions?.includes(role);
  }

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const user = await this.findUser(createTicketDto.userId);

    if (!user.ticketsEnabled) {
      throw new BadRequestException('Este empleado no tiene acceso para crear tickets');
    }

    const ticket = this.ticketRepository.create({
      ...createTicketDto,
      ticketStatus: TicketStatus.UPCOMING,
    });

    return this.ticketRepository.save(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketRepository.find({
      relations: { user: true, responses: { user: true } },
      order: { updatedAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: { userId },
      relations: { user: true, responses: { user: true } },
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: { user: true, responses: { user: true } },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket con ID ${id} no encontrado`);
    }

    return ticket;
  }

  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);
    Object.assign(ticket, updateTicketDto);
    return this.ticketRepository.save(ticket);
  }

  async updateStatus(
    id: number,
    updateTicketStatusDto: UpdateTicketStatusDto,
  ): Promise<Ticket> {
    const ticket = await this.findOne(id);
    ticket.ticketStatus = updateTicketStatusDto.ticketStatus;
    return this.ticketRepository.save(ticket);
  }

  async createResponse(
    ticketId: number,
    dto: CreateTicketResponseDto,
  ): Promise<TicketResponse> {
    await this.findOne(ticketId);
    const user = await this.findUser(dto.userId);

    if (!this.userHasRole(user, UserRole.IT) && !this.userHasRole(user, UserRole.ADMIN)) {
      throw new BadRequestException('Solo informática o administración pueden responder tickets');
    }

    if (!dto.message?.trim() && !dto.attachment) {
      throw new BadRequestException('La respuesta debe tener texto o imagen');
    }

    const response = this.ticketResponseRepository.create({
      ticketId,
      userId: dto.userId,
      message: dto.message?.trim() || null,
      attachment: dto.attachment || null,
    });

    return this.ticketResponseRepository.save(response);
  }

  async findResponses(ticketId: number): Promise<TicketResponse[]> {
    await this.findOne(ticketId);

    return this.ticketResponseRepository.find({
      where: { ticketId },
      relations: { user: true },
      order: { createdAt: 'ASC' },
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    const ticket = await this.findOne(id);
    await this.ticketRepository.remove(ticket);
    return { message: 'Ticket eliminado correctamente' };
  }
}
