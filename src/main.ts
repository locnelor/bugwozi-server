import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as bodyParser from "body-parser"
import * as session from "express-session"
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare module "express-session" {
  interface SessionData {

  }
}


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //全局验证管道
  app.useGlobalPipes(new ValidationPipe);
  app.use(bodyParser.json({ limit: "50mb" }))
  //设置前缀
  // app.setGlobalPrefix("/api")

  app.use(session({
    secret: "sbppk",
    cookie: { maxAge: 100 },
    saveUninitialized: true,
    resave: true
  }))

  //跨域
  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true
  })
  const options = new DocumentBuilder()
    .setTitle('阔哥牛逼')
    .setDescription('阔哥 API 文档')
    .setVersion('1.0')
    .addCookieAuth("token")
    .build()
  const document = SwaggerModule.createDocument(app, options)
  // 设置 swagger 网址
  SwaggerModule.setup('docs', app, document);


  await app.listen(8080);
}
bootstrap();
