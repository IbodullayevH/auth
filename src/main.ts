import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const PORT = process.env.SERVER_PORT || 5000
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix(`api`)
    app.use(cookieParser())

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
          const messages = errors.map((error) => {
            return {
              property: error.property,
              constraints: error.constraints,
            };
          });
          return new BadRequestException(messages);
        }
      })
    )

    const config = new DocumentBuilder()
      .setTitle(`Test uchun hammasi`)
      .setDescription(`Authenticationni yaxshi o'rganish uchun`)
      .setVersion(`1.0`)
      .addTag(`Rest-API`)
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/document', app, document)

    app.listen(PORT, () => {
      console.log(`Server is run 🔥 ${PORT}`)
    })

  } catch (error) {
    throw new Error()
  }
}
bootstrap();

