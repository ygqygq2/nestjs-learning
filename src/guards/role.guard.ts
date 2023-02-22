import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '@/decorators/roles.decorator';
import { Role } from '@/enum/roles.enum';
import { UserService } from '@/user/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndMerge<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const user = await this.userService.find(req.user.username);
    const roleIds = user.roles.map((role) => role.id);
    const flag = requiredRoles.some((role) => roleIds.includes(role));

    return flag;
  }
}
