import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableVersioning({type: VersioningType.URI, defaultVersion: '1'});
  await app.listen(process.env.PORT ?? 0);
  console.log(`Back de veterinaria corriendo en : ${await app.getUrl()}`);
}
bootstrap();
