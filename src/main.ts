import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://chat-app-xi-teal-10.vercel.app/'
  });
  await app.listen(process.env.PORT ?? 3000).then(()=>{
    console.log("running")
  });
}
bootstrap();
