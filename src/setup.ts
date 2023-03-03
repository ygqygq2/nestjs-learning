import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AllExceptionFilter } from './filters/all-exception.filter';

export const setupApp = (app: INestApplication) => {
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
};
