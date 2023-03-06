// import request from 'supertest';
// import* as pactum from 'pactum';
import * as Spec from 'pactum/src/models/Spec';

describe('AppController (e2e)', () => {
  // let app: INestApplication;

  let spec: Spec;
  beforeEach(() => {
    // console.log('app', global.app);
    // pactum.request.setBaseUrl('http://localhost:3000');
    spec = global.spec as Spec;
  });

  // eslint-disable-next-line jest/expect-expect
  it('/api (GET)', () => {
    // return request(app.getHttpServer()).get('/api').expect(200).expect('Hello World!');
    // return pactum.spec.get('/api').expectStatus(200).expectBodyContains('Hello World!');
    return spec.get('/api').expectStatus(200).expectBodyContains('Hello World!');
  });
});
