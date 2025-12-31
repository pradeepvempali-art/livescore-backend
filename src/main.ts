import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // frontend URL
    credentials: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await app.listen(3000);
}
void bootstrap();
