import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TicketResponse } from '../../tickets/entities/ticket-response.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { UserRole } from '../users.enum';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 'Jordi' })
  @Column()
  name!: string;

  @ApiProperty({ example: 'Garcia' })
  @Column()
  lastName!: string;

  @ApiProperty({ example: 'jordi@empresa.com' })
  @Column({ unique: true })
  email!: string;

  @ApiProperty({ example: '123456' })
  @Column()
  password!: string;

  @ApiProperty({ example: '2000-01-01' })
  @Column({
  type: 'date',
  nullable: true,
  })
  birthDate!: string;
  
  @ApiProperty({ example: 'Koral Descanso' })
  @Column()
  company!: string;

  @ApiProperty({ example: 'Barcelona' })
  @Column()
  workCenter!: string;

  @ApiProperty({ example: 'Contabilidad' })
  @Column()
  department!: string;

  @ApiProperty({ example: 'Tecnico administrativo' })
  @Column()
  position!: string;

  @ApiProperty({ example:true })
  @Column({ default: true })
  ticketsEnabled!: boolean;

  @ApiProperty({ example: [UserRole.EMPLOYEE], enum: UserRole, isArray: true })
  @Column('simple-array')
  permissions!: UserRole[];

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets!: Ticket[];

  @OneToMany(() => TicketResponse, (response) => response.user)
  ticketResponses!: TicketResponse[];

  departmentPosition: any;
}
