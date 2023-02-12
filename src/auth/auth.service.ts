import { ForbiddenException, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as argon2 from 'argon2';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwt: JwtService) {}

  async signin(username: string, password: string) {
    // const res= await this.userService.findAll({ username} as GetUserDto);
    const user = await this.userService.find(username);
    if (!user) {
      throw new ForbiddenException('用户不存在，请注册');
    }

    // 密码进行比对
    try {
      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        throw new ForbiddenException('用户名或密码错误');
      }
    } catch (error) {
      throw new ForbiddenException('argon2 验证错误');
    }

    // if (user && user.password=== password) {
    //   // 生成 token
    return this.jwt.signAsync(
      {
        username: user.username,
        sub: user.id,
      },
      // 局部设置过期时间
      // {
      //   expiresIn: '1h',
      // },
    );
    // }
  }

  async signup(username: string, password: string) {
    const user = await this.userService.find(username);
    if (user) {
      throw new ForbiddenException('用户已存在');
    }
    const res = await this.userService.create({ username, password });
    return res;
  }
}
