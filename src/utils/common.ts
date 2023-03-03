import { Roles } from '@/decorators/roles.decorator';
import { Logs } from '@/logs/logs.entity';
import { Menus } from '@/menus/menus.entity';
import { User } from '@/user/user.entity';

// eslint-disable-next-line consistent-return
export const getEntities = (path: string) => {
  // /users ->User, /logs -> Logs, /roles -> Roles, /menus -> Menus, /auth -> 'Auth'
  const map = {
    '/users': User,
    '/logs': Logs,
    '/roles': Roles,
    '/menus': Menus,
    '/auth': 'Auth',
  };

  for (let i = 0; i < Object.keys(map).length; i++) {
    const key = Object.keys(map)[i];
    if (path.startsWith(key)) {
      return map[key];
    }
  }
};
