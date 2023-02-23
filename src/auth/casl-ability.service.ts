import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { Menus } from '@/menus/menus.entity';
import { getEntities } from '@/utils/common';

import { UserService } from '../user/user.service';

@Injectable()
export class CaslAbilityService {
  constructor(private userService: UserService) {}

  async forRoot(username: string) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { can, build } = new AbilityBuilder(createMongoAbility);

    const user = await this.userService.find(username);
    // user -> roles -> menus 去重
    const obj = {} as Record<string, unknown>;
    user.roles.forEach((role) => {
      role.menus.forEach((menu) => {
        obj[menu.id] = menu;
      });
    });
    const menus = Object.values(obj) as Menus[];
    menus.forEach((menu) => {
      const actions = menu.acl.split(',');
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        can(action, getEntities(menu.path));
      }
    });

    // can('manage', 'all');
    // can('read', Logs);
    // cannot('update', Logs);

    const ability = build({
      detectSubjectType: (object) => object.constructor,
    });

    return ability;
  }
}
