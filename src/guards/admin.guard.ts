import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { User } from '@/user/user.entity';

import { UserService } from '../user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 获取请求对象
    const req = context.switchToHttp().getRequest();
    // 2. 获取讲求中的用户信用进行逻辑上的判断
    const user = (await this.userService.find(req.user.username)) as User;
    // 普通用户
    // 后面加入更多的逻辑
    if (user.roles.filter((role) => role.id === 2).length > 0) {
      return true;
    }
    return false;
  }
}
