import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TicketPriority } from '../tickets.enum';

export class UpdateTicketDto {
  @ApiPropertyOptional({ example: 'Portatil sin arrancar' })
  @IsOptional()
  @IsString()
  ticketTitle?: string;

  @ApiPropertyOptional({ example: 'El portatil no arranca desde esta mañana' })
  @IsOptional()
  @IsString()
  ticketDescription?: string;

  @ApiPropertyOptional({ example: 'data:image/jpeg;base64,/9j/4AAQ...' })
  @IsOptional()
  @IsString()
  ticketAttachment?: string;

  @ApiPropertyOptional({ example: TicketPriority.HIGH, enum: TicketPriority })
  @IsOptional()
  @IsEnum(TicketPriority)
  ticketPriority?: TicketPriority;
}
