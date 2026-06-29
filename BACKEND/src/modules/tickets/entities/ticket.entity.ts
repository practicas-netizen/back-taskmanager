import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TicketPriority, TicketStatus } from '../tickets.enum';
import { TicketResponse } from './ticket-response.entity';

@Entity({ name: 'tickets' })
export class Ticket {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 'No funciona el portatil' })
  @Column()
  ticketTitle!: string;

  @ApiPropertyOptional({ example: 'El equipo no arranca desde esta mañana' })
  @Column({ type: 'text', nullable: true })
  ticketDescription?: string;

  @ApiPropertyOptional({ example: 'data:image/jpeg;base64,/9j/4AAQ...' })
  @Column({ type: 'longtext', nullable: true })
  ticketAttachment?: string | null;

  @ApiProperty({ example: TicketStatus.UPCOMING, enum: TicketStatus })
  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.UPCOMING })
  ticketStatus!: TicketStatus;

  @ApiProperty({ example: TicketPriority.MEDIUM, enum: TicketPriority })
  @Column({ type: 'enum', enum: TicketPriority, default: TicketPriority.MEDIUM })
  ticketPriority!: TicketPriority;

  @ApiProperty({ example: 1 })
  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => TicketResponse, (response) => response.ticket)
  responses!: TicketResponse[];

  @ApiProperty({ example: '2026-06-02T10:00:00.000Z' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-06-02T10:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
