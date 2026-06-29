import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateTicketResponseDto {
  @ApiProperty({ example: 2 })
  @IsNumber()
  userId!: number;

  @ApiPropertyOptional({ example: 'Hemos revisado el equipo y ya vuelve a funcionar.' })
  @ValidateIf((dto) => !dto.attachment)
  @IsString()
  message?: string;

  @ApiPropertyOptional({ example: 'data:image/png;base64,iVBORw0KGgo...' })
  @IsOptional()
  @IsString()
  attachment?: string;
}
