// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // O caminho agora aponta para a pasta que foi copiada para dentro da 'dist'
  app.useStaticAssets(join(__dirname, '..', 'swagger-ui-dist'), {
    prefix: '/api/docs/',
  });

  const config = new DocumentBuilder()
    .setTitle('Corrida API')
    .setDescription('Documentação da API de Corridas')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();