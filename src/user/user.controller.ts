import { Controller, Delete, Get, HttpException, HttpStatus, Inject, LoggerService, Patch, Post } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    protected configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.logger.log('UserController init');
  }

  @Get()
  getUsers(): any {
    const user = { isAdmin: false };
    if (!user.isAdmin) {
      throw new HttpException('User is not admin, Forbidden to access getAllUsers', HttpStatus.FORBIDDEN);
    }
    this.logger.log('UserController getUsers succes');
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
}
