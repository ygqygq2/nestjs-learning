import { Controller, Delete, Get, Inject, LoggerService, Patch, Post, Query, UseFilters } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { TypeormFilter } from '@/filters/typeorm.filter';

import { GetUserDto } from './dto/get-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
@UseFilters(new TypeormFilter())
export class UserController {
  constructor(
    private userService: UserService,
    protected configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.logger.log('UserController init');
  }

  /**
   *
   * @param query - 查询参数
   * @param query.page - 页码
   * @param query.limit - 每页数量
   * @param query.condition - 查询条件
   * @returns
   */
  @Get()
  getUsers(@Query() query: GetUserDto): any {
    return this.userService.findAll(query);
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
  getUserProfile(@Query('id') id: number): any {
    return this.userService.findProfile(id);
  }

  @Get('/logs')
  getUserLogs(): any {
    return this.userService.findUserLogs(2);
  }

  @Get('/logsByGroup')
  async getLogsByGroup(): Promise<any> {
    const res = this.userService.findLogsByGroup(2);
    return (await res).map((o) => ({
      result: o.result,
      count: o.count,
    }));
  }

  // @Get()
  // getUser(@Param() '/:id'): any {
  //   return ""
  // }
}
