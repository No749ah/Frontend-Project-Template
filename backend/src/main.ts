import * as dotenv from 'dotenv';
import * as path from 'path';
import ProjectModeValue from '../project_mode/mode/projectmode';

if (ProjectModeValue == 'testing') {
  const envPath = path.resolve(__dirname, './../../../config/.env');
  dotenv.config({ path: envPath });
} else if (ProjectModeValue == 'production' || ProjectModeValue == 'docker') {
  const envPath = path.resolve(__dirname, './../../config/.env');
  dotenv.config({ path: envPath });
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as os from 'os';
import * as pk from 'pkginfo';
import { Logger } from '@nestjs/common';

pk(module);

const serverProtocol = process.env.SERVER_PROTOCOL || 'http';
const httpInterface = process.env.SERVER_LISTEN_ON || '0.0.0.0';
const accessServer = process.env.URI_SERVER || os.hostname();
const port = process.env.SERVER_PORT || 3000;

// read from package.json
const name = module.exports.name;
const version = module.exports.version;
const description = module.exports.description;
const authorInfo = module.exports.author.split('|');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .setContact(authorInfo[0], authorInfo[1], authorInfo[2])
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  SwaggerModule.setup('api-json', app, document);

  await app.listen(port, httpInterface);

  Logger.debug(
    `The server is now available at: ${serverProtocol}://${accessServer}:${port}`,
  );
  Logger.debug(
    `The API documentation in version ${version} is available at: ${serverProtocol}://${accessServer}:${port}/api`,
  );
}

bootstrap().then(() => Logger.log(`Server is online!`));
