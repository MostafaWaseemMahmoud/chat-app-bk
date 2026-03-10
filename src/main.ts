import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        'https://chat-app-xi-teal-10.vercel.app',
        'http://localhost:5173'
      ],
      methods: ['GET','POST','PUT','DELETE','PATCH'],
      credentials: true
    }
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();