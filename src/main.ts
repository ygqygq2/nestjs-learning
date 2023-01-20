import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { getServerConfig } from '../ormconfig';

import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/all-exception.filter';

async function bootstrap() {
  const config = getServerConfig();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {});

  // 指定url前缀
  app.setGlobalPrefix('api');

  // winston logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 全局使用过滤器
  // 全局过滤器只能有一个
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));

  // 允许跨域
  app.enableCors();
  const port = typeof config['APP_PORT'] === 'string' ? parseInt(config['APP_PORT'], 10) : 3000;
  await app.listen(port, '0.0.0.0');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
