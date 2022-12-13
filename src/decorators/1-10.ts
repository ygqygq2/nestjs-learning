import { parse, parseDecorator, UserType } from './1-7';

// 角色守卫
export const RoleGuardDecorator = (roles: string[]) => {
  console.log('开始验证角色');
  return function roleGuard(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // 根据传入的参数定义守卫所需的角色
    Reflect.defineMetadata('roles', roles, target, propertyKey);
    const method = descriptor.value;
    descriptor.value = function (...args: any[]) {
      // 获取当前用户的角色
      const currentRoles = target.getRoles();
      // 获取我们定义的操作此方法所需的角色
      const needRoles = Reflect.getMetadata('roles', target, propertyKey);
      // 判断当前用户是否拥有所需的角色,没有则抛出异常
      for (const role of needRoles) {
        if (!currentRoles.includes(role)) {
          throw new Error(`you have not permission to run ${propertyKey}`);
        }
      }
      console.log('验证角色完毕');
      return method.apply(this, args);
    };
    return descriptor;
  };
};

export class UserService {
  protected users: UserType[] = [
    { id: 1, username: 'admin' },
    { id: 2, username: 'pincman' },
  ];

  getUsers() {
    return this.users;
  }

  // 设定当前用户的角色
  getRoles() {
    return ['user'];
  }

  @RoleGuardDecorator(['admin'])
  // 在装饰器中使用Reflect.defineMetadata()放定义roles只是为了方便封装
  // 当然,我们也可以在方法上直接定义roles,如下
  // Reflect.metadata('roles',['admin'])
  @parseDecorator
  delete(@parse((arg: any) => Number(arg)) id: number): UserService {
    this.users = this.getUsers().filter((userObj) => userObj.id !== id);
    return this;
  }
}

export const exp10 = () => {
  // ...
  console.log();
  console.log('-----------------------示例10:自定义元元素反射-----------------------');
  console.log('-----------------------添加角色守卫来判断当前用户是否有删除权限-----------------------');
  console.log();
  const user = new UserService();
  user.delete(1);
  console.log(user.getUsers());
  console.log();
  console.log('-----------------------示例10:执行完毕-----------------------');
};

// 控制台将输出异常
// Error: you have not permission to run delete
