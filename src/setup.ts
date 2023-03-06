import { INestApplication, ValidationPipe } from '@nestjs/common';
// import{ HttpAdapterHost} from '@nestjs/core';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { getServerConfig } from '../ormconfig';

// import{ AllExceptionFilter} from './filters/all-exception.filter';

export const setupApp = (app: INestApplication) => {
  const config = getServerConfig();

  const flag: boolean = config['LOG_ON'] === 'true';
  // winston logger
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  flag && app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // 指定 url 前缀
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  // 全局使用过滤器
  // 全局过滤器只能有一个
  // const httpAdapter= app.get(HttpAdapterHost);
  // const logger= new Logger();
  // app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));

  // 全局拦截器
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除在类上不存在的字段，生产环境建议开启，提高安全性
      whitelist: true,
    }),
  );

  // app.useGlobalGuards()
  // 弊端 -> 无法使用 DI -> 无法访问 userService

  // app.useGlobalInterceptors(new SerializeInterceptor());

  // helmet 头部安全
  app.use(helmet());

  // rateLimit 限流
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minutes
      max: 300, // limit each IP to 100 requests per windowMs
    }),
  );
};
