import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';

import { AppFactory } from './app.factory';

let appFactory: AppFactory;
let app: INestApplication;

beforeEach(async () => {
  appFactory = await AppFactory.init();
  app = appFactory.instance;

  pactum.request.setBaseUrl(await app.getUrl());
  global.pactum = pactum;
  global.spec = pactum.spec();

  console.log('Setting Pactum global variables');
});

afterEach(async () => {
  await appFactory?.destroy();
  await appFactory?.cleanup();
  await app.close();

  console.log('Cleaning up Pactum global variables');
});
