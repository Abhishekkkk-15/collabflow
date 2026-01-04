import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ValidationExceptionFilter } from './common/filter/validation-exception.filter';
import { AllExceptionFilter } from './common/filter/all-exception.filter';
import { RedisIoAdapter } from './redis-io.adapter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.NEXT_PUBLIC_API_URL!,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new AllExceptionFilter(),
  );

  app.use(cookieParser());
  const redisAdapter = new RedisIoAdapter(app);
  await redisAdapter.connectToRedis();
  app.useWebSocketAdapter(redisAdapter);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
