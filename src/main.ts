import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import helmet from 'helmet';
// import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  // const logger = app.get(Logger);
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  // app.enableCors({
  //     credentials: true,
  //     origin: process.env.CLIENT_URL
  // });

  // app.use(cors({
  //   credentials: true,
  //   origin: process.env.CLIENT_URL
  // }));
  await app.listen(3000);
  // logger.log(`Application listening at ${await app.getUrl()}`);
}
bootstrap();
