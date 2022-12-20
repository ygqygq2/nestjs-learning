import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {NestFastifyApplication, FastifyAdapter} from '@nestjs/platform-fastify';
// import { exp1 } from './decorators';
// import { exp2 } from './decorators';
// import { exp3 } from './decorators';
// import { exp4 } from './decorators';
// import { exp5 } from './decorators';
// import { exp6 } from './decorators';
// import { exp7 } from './decorators';
// import { exp8 } from './decorators';
// import { exp9 } from './decorators';
// import { exp10 } from './decorators';
import { exp11 } from './decorators';

async function bootstrap() {
  // exp1();
  // exp2();
  // exp3();
  // exp4();
  // exp5();
  // exp6();
  // exp7();
  // exp8();
  // exp9();
  // exp10();
  exp11();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  // 指定url前缀
  app.setGlobalPrefix('api');
  // 允许跨域
  app.enableCors();
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
