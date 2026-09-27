import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignora y elimina cualquier campo que no este definido en el DTO
      forbidNonWhitelisted: true, // Lanza error 400 si envian propiedades no permitidas
      transform: true, // Convierte tipos automaticamente segun el DTO (ej. string de URL param a number)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
