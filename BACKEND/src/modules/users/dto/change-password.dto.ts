/**
 * Este es un formato de datos para cambiar la contraseña desde el perfil de un empleado.
 *
 * Funcionalidad:
 * 1. currentPassword: La contraseña actual del empleado se verifica con la versión 
 *   guardada en la base de datos antes de permitir el cambio. Si no coincide, el servidor devuelve un error.
 * 
 * 2. newPassword: La nueva contraseña que el empleado quiere establecer debe 
 *   tener al menos 6 caracteres para evitar contraseñas muy cortas.
 *
 * Este formato de datos es diferente del que se utiliza para actualizar 
 * la información de un empleado. Ese formato es utilizado por el administrador 
 * para editar cualquier campo de un empleado. Este formato es exclusivo para que el 
 * empleado mismo pueda cambiar su contraseña de manera segura desde su perfil.
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'contrasenya_actual' })
  @IsString()
  currentPassword!: string;

  @ApiProperty({ example: 'nova_contrasenya_segura' })
  @IsString()
  @MinLength(6, { message: 'La nova contrasenya ha de tenir mínim 6 caràcters' })
  newPassword!: string;
}