import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { TicketResponse } from './entities/ticket-response.entity';
import { Ticket } from './entities/ticket.entity';

import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TicketResponse, User]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
