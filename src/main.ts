import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { getServerConfig } from '../ormconfig';

import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/all-exception.filter';

async function bootstrap() {
  const config = getServerConfig();
  // 切换 fastify
  // const app= await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {});
  // 默认 express
  const app = await NestFactory.create(AppModule, {});

  // 指定 url 前缀
  app.setGlobalPrefix('api');

  // winston logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 全局使用过滤器
  // 全局过滤器只能有一个
  const httpAdapter = app.get(HttpAdapterHost);
  const logger = new Logger();
  app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));

  // 全局拦截器
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除在类上不存在的字段，生产环境建议开启，提高安全性
      // whitelist: true,
    }),
  );

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
