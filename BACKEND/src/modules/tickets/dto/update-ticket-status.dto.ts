import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TicketStatus } from '../tickets.enum';

export class UpdateTicketStatusDto {
  @ApiProperty({ example: TicketStatus.IN_PROGRESS, enum: TicketStatus })
  @IsEnum(TicketStatus)
  ticketStatus!: TicketStatus;
}
