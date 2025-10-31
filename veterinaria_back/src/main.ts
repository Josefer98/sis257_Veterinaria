import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableVersioning({type: VersioningType.URI, defaultVersion: '1'});
  
  const config = new DocumentBuilder()
    .setTitle('API Rest Veterinaria')
    .setDescription('API Rest de la Veterinaria')
    .setVersion('1.0')
    .addTag('clientes')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, documentFactory);
  
  await app.listen(process.env.PORT ?? 0);
  console.log(`Back de veterinaria corriendo en : ${await app.getUrl()}`);
}
bootstrap();
