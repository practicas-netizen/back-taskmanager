/**
 * Este módulo se utiliza para enviar correos electrónicos.
 *
 * Sirve para: dos cosas principales:
 * 
 * 1. Registra MailService como proveedor y lo exporta. 
 *    De esta manera, cualquier otro módulo, como TicketsModule o 
 *    UsersModule, puede utilizarlo para enviar correos sin tener que configurar SMTP cada vez.
 * 
 * 2. Este módulo se importa una sola vez en AppModule.
*/

import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}