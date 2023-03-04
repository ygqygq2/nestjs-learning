/* eslint-disable jest/expect-expect */
import Spec from 'pactum/src/models/Spec';

describe('Auth 登录认证 e2e 测试', () => {
  let spec: Spec;

  beforeEach(() => {
    spec = global.spec as Spec;
  });

  const user = {
    username: 'test123',
    password: '123456',
  };

  // 注册用户
  it('注册用户', () => {
    return spec
      .post('/api/auth/signup')
      .withBody(user)
      .expectStatus(201)
      .expectBodyContains(user.username)
      .expectJsonLike({
        id: 1,
        username: user.username,
        roles: [
          {
            id: 2,
            name: '普通用户',
          },
        ],
      });
  });
  // 注册新用户
  // 重复注册该用户
  it('重复注册该用户', async () => {
    await global.pactum.spec().post('/api/auth/signup').withBody(user);

    return spec.post('/api/auth/signup').withBody(user).expectStatus(403).expectBodyContains('用户已存在');
  });
  it('注册用户传参异常 username', () => {
    return spec
      .post('/api/auth/signup')
      .withBody(user)
      .expectStatus(400)
      .expectBodyContains('"用户名长度必须在6到20之间');
  });

  // todo 作业：自行完成 username,password 效验测试用例
  // 登录用户
  it('登录用户', async () => {
    await global.pactum.spec().post('/api/auth/signup').withBody(user);

    return spec.post('/api/auth/signin').withBody(user).expectStatus(201).expectBodyContains('access_token');
  });

  it('登录用户传参异常 username', async () => {
    await global.pactum.spec().post('/api/auth/signup').withBody(user);

    return spec
      .post('/api/auth/signin')
      .withBody({ username: 'test124' })
      .expectStatus(400)
      .expectBodyContains('用户名长度必须在 6 到 20 之间，当前传递的值是：test124');
  });
  // 登录用户不存在
  it('登录用户不存在', async () => {
    // await global.pactum.spec().post('/api/auth/signup').withBody(user);

    return spec.post('/api/auth/signin').withBody(user).expectStatus(403).expectBodyContains('用户不存在，请注册');
  });

  // 登录用户密码错误
  it('登录用户密码错误', async () => {
    await global.pactum.spec().post('/api/auth/signup').withBody(user);

    return spec
      .post('/api/auth/signin')
      .withBody({ ...user, password: '1234567' })
      .expectStatus(403)
      .expectBodyContains('用户名或者密码错误');
  });

  // 补充说明的：
  // user 模块 -> headers -> token 信息 -> beforeEach -> 获取 token
});