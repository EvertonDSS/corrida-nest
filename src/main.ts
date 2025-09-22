// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Define que todas as rotas da sua aplicação começarão com '/api'
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Corrida API')
    .setDescription('Documentação da API de Corridas')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  // O caminho do Swagger agora é apenas 'docs', pois o prefixo 'api' já é global.
  // URL final: /api/docs
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();