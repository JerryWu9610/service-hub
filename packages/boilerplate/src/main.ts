import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { getConfig } from '@/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const config = getConfig();

  const app = await NestFactory.create(AppModule);

  if (config.swagger.enabled) {
    const docBuilder = new DocumentBuilder()
      .setTitle(config.swagger.title)
      .setDescription(config.swagger.description)
      .setVersion(config.swagger.version)
      .build();
    const doc = SwaggerModule.createDocument(app, docBuilder);
    SwaggerModule.setup(config.swagger.path, app, doc);
  }

  await app.listen(config.app.port);
  Logger.log(`Server running on http://localhost:${config.app.port}`);
  config.swagger.enabled &&
    Logger.log(
      `Swagger running on http://localhost:${config.app.port}${config.swagger.path}`,
    );
}
bootstrap();
