import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Ticket } from './ticket.entity';

@Entity({ name: 'ticket_responses' })
export class TicketResponse {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 1 })
  @Column()
  ticketId!: number;

  @ManyToOne(() => Ticket, (ticket) => ticket.responses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticketId' })
  ticket!: Ticket;

  @ApiProperty({ example: 2 })
  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.ticketResponses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ApiPropertyOptional({ example: 'Hemos revisado el equipo y ya vuelve a funcionar.' })
  @Column({ type: 'text', nullable: true })
  message?: string | null;

  @ApiPropertyOptional({ example: 'data:image/png;base64,iVBORw0KGgo...' })
  @Column({ type: 'longtext', nullable: true })
  attachment?: string | null;

  @ApiProperty({ example: '2026-06-02T10:00:00.000Z' })
  @CreateDateColumn()
  createdAt!: Date;
}
