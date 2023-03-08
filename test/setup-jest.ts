import { INestApplication } from '@nestjs/common';

import * as pactum from 'pactum';

import { AppFactory } from './app.factory';
import { InitE2E } from './init.e2e';

let appFactory: AppFactory;
let app: INestApplication;

global.beforeAll(async () => {
  const initE2E = new InitE2E();
  return initE2E.initDB();
});

global.beforeEach(async () => {
  appFactory = await AppFactory.init();
  // 初始化基础数据库导入 SQL
  // await appFactory.initDB();
  // await appFactory?.destroy();
  app = appFactory.instance;

  pactum.request.setBaseUrl(await app.getUrl());
  pactum.settings.setLogLevel('SILENT');
  global.pactum = pactum;
  global.spec = pactum.spec();
});

global.afterEach(async () => {
  // 清除脏数据
  await appFactory?.cleanup();
  await app?.close();
  // console.log('Cleaning up Pactum global variables');
});

global.afterAll(async () => {
  // 断开与数据库连接
  await appFactory?.destroy();
});
