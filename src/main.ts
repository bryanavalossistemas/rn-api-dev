import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.use(morgan('dev'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0', () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
}
void bootstrap();
