/**
 * Este es el punto de entrada de nuestra aplicación NestJS, que es el backend.
 *
 * Funciona de la siguiente manera:
 * 
 * 1. Crea una instancia de la aplicación Nest a partir 
 *    del módulo principal, que es AppModule.
 * 
 * 2. Establece un prefijo global para todas las rutas, 
 *    que es '/api'. Por ejemplo, las rutas quedarán así: /api/users.
 * 
 * 3. Aumenta el límite de tamaño del cuerpo de las peticiones JSON y urlencoded a 10MB.
 *    Esto es necesario porque el frontend envía archivos adjuntos de tickets 
 *    (imágenes o PDF) codificados en Base64, lo que hace que su tamaño aumente 
 *    respecto al archivo original. Sin este aumento, Express rechaza con un error 413 
 *    “entidad de solicitud demasiado grande” cualquier ticket con un adjunto de más de 75KB aproximadamente.
 * 
 * 4. Activa el ValidationPipe de forma global. Esto hace que los DTOs 
 *    (Data Transfer Objects) con class-validator se validen automáticamente en cada petición.
 * 
 * 5. Configura CORS (Cross-Origin Resource Sharing) para permitir peticiones 
 *    desde el frontend tanto en local como en producción (Vercel).
 * 
 * 6. Expone la documentación de Swagger en la ruta /api.
*/

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aumentar el límite de tamaño del body — necesario para adjuntos en Base64
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://front-gestion-tickets.vercel.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API Gestión de Tickets')
    .setDescription('Backend para empleados, autenticacion y tickets de soporte')
    .setVersion('1.0')
    .addTag('users')
    .addTag('tickets')
    .addTag('Auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3005);

  console.log('Backend corriendo en http://localhost:3005');
  console.log('Swagger disponible en http://localhost:3005/api');
}

bootstrap();
