import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TicketPriority } from '../tickets.enum';

export class CreateTicketDto {
  @ApiProperty({ example: 'No funciona el portatil' })
  @IsString()
  @IsNotEmpty()
  ticketTitle!: string;

  @ApiPropertyOptional({ example: 'El equipo no arranca desde esta mañana' })
  @IsOptional()
  @IsString()
  ticketDescription?: string;

  @ApiPropertyOptional({ example: 'data:image/jpeg;base64,/9j/4AAQ...' })
  @IsOptional()
  @IsString()
  ticketAttachment?: string;

  @ApiPropertyOptional({ example: TicketPriority.MEDIUM, enum: TicketPriority })
  @IsOptional()
  @IsEnum(TicketPriority)
  ticketPriority?: TicketPriority;

  @ApiProperty({ example: 1 })
  @IsNumber()
  userId!: number;
}
