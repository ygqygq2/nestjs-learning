import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, protected configService: ConfigService) {}

  @Get()
  getUsers(): any {
    return this.userService.findAll();
    // return this.userService.getUsers();
  }

  @Post()
  addUser(): any {
    const user = { username: 'ygqygq2', password: '123456' } as User;
    return this.userService.create(user);
    // return this.userService.addUser();
  }

  @Patch()
  updateUser(): any {
    return this.userService.update(1, { username: 'ygqygq2', password: 'ygqygq2' });
  }

  @Delete()
  removeUser(): any {
    return this.userService.remove(1);
  }

  @Get('/profile')
  getUserProfile(): any {
    return this.userService.findProfile(2);
  }

  @Get('/logs')
  getUserLogs(): any {
    return this.userService.findUserLogs(2);
  }
}
