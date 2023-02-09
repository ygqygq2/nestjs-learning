import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwt: JwtService) {}

  async signin(username: string, password: string) {
    // const res= await this.userService.findAll({ username} as GetUserDto);
    const user = await this.userService.find(username);
    if (user && user.password === password) {
      // 生成 token
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
    }
    throw new UnauthorizedException();
  }

  async signup(username: string, password: string) {
    const res = await this.userService.create({ username, password });
    return res;
  }
}
