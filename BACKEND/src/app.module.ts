import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { AuthModule } from './modules/auth/auth.module'; 
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'jordi_admin',
      password: process.env.DB_PASSWORD || 'jordipassword2026',
      database: process.env.DB_NAME || 'jordi_tickets_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    TicketsModule,
    AuthModule, 
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
