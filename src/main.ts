import { NestFactory } from '@nestjs/core';

import { getServerConfig } from '../ormconfig';

import { AppModule } from './app.module';
import { setupApp } from './setup';

async function bootstrap() {
  const config = getServerConfig();
  // 切换 fastify
  // const app= await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {});
  // 默认 express
  const app = await NestFactory.create(AppModule, {});

  setupApp(app);

  // app.useGlobalGuards()
  // 弊端 -> 无法使用 DI -> 无法访问 userService

  // app.useGlobalInterceptors(new SerializeInterceptor());

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
