import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTicketResponseDto } from './dto/create-ticket-response.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { TicketsService } from './tickets.service';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear ticket de soporte' })
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los tickets' })
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar tickets de un empleado' })
  findByUser(@Param('userId') userId: string) {
    return this.ticketsService.findByUser(+userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener ticket por ID' })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Mover ticket entre UPCOMING, IN_PROGRESS y DONE' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateTicketStatusDto: UpdateTicketStatusDto,
  ) {
    return this.ticketsService.updateStatus(+id, updateTicketStatusDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar datos del ticket' })
  update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Post(':id/responses')
  @ApiOperation({ summary: 'Responder ticket con texto o imagen' })
  createResponse(
    @Param('id') id: string,
    @Body() createTicketResponseDto: CreateTicketResponseDto,
  ) {
    return this.ticketsService.createResponse(+id, createTicketResponseDto);
  }

  @Get(':id/responses')
  @ApiOperation({ summary: 'Listar respuestas de un ticket' })
  findResponses(@Param('id') id: string) {
    return this.ticketsService.findResponses(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar ticket' })
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
