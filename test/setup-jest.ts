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
  await appFactory?.destory();
  await appFactory.initDB();
  app = appFactory.instance;

  pactum.request.setBaseUrl(await app.getUrl());
  global.pactum = pactum;
  global.spec = pactum.spec();
  // global.app = app;
});

global.afterEach(async () => {
  // await appFactory.cleanup();
  await appFactory?.destory();
  await app?.close();
});
