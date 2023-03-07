import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';

import { AppFactory } from './app.factory';

let appFactory: AppFactory;
let app: INestApplication;

global.beforeEach(async () => {
  // const moduleFixture: TestingModule= await Test.createTestingModule({
  //   imports: [AppModule],
  // }).compile();

  // app= moduleFixture.createNestApplication();
  // setupApp(app);
  // await app.init();

  appFactory = await AppFactory.init();
  await appFactory?.destroy();
  // 初始化基础数据库导入 SQL
  // await appFactory.initDB();
  app = appFactory.instance;

  pactum.request.setBaseUrl(await app.getUrl());
  pactum.settings.setLogLevel('SILENT');

  global.pactum = pactum;
  global.spec = pactum.spec();
  // global.app= app;
  // console.log('Setting Pactum global variables');
});

global.afterEach(async () => {
  // 清除脏数据
  await appFactory?.cleanup();
  // 断开与数据库边接
  await appFactory?.destroy();
  await app?.close();

  // console.log('Cleaning up Pactum global variables');
});
