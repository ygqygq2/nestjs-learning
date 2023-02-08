import { Injectable } from '@nestjs/common';

import { GetUserDto } from '@/user/dto/get-user.dto';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signin(username: string, password: string) {
    const res = await this.userService.findAll({ username } as GetUserDto);
    return res;
  }

  signup(username: string, password: string) {}
}
