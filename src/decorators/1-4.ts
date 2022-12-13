type UserProfile = Record<string, any> & {
  phone?: number;
  address?: string;
};

const ProfileDecorator = (profile: UserProfile) => (target: any) => {
  const Original = target;
  let userinfo = '';
  Object.keys(profile).forEach((key) => {
    userinfo = `${userinfo}.${profile[key].toString()}`;
  });
  // 添加一个原型属性
  Original.prototype.userinfo = userinfo;
  // 使用函数创建一个新的类(类构造器),返回值为传入类的对象,这样就重载了构造函数
  function constructor(...args: any[]) {
    console.log('contruct has been changed');
    return new Original(...args);
  }
  // 赋值原型链
  constructor.prototype = Original.prototype;
  // 添加一个静态属性
  constructor.myinfo = `myinfo ${userinfo}`;
  return constructor as typeof Original;
};

// 因为静态属性是无法通过[key: string]: any;获取类型提示的,所以这里添加一个接口用于动态各类添加静态属性
interface StaticUser {
  new (): UserProfile;
  myinfo: string;
}

@ProfileDecorator({ phone: 133, address: 'zhejiang' })
class ProfileService {}

export const exp4 = () => {
  console.log();
  console.log('-----------------------示例4:修类的构造函数,原型属性,静态属性等-----------------------');
  console.log('-----------------------设置原型属性值,重载构造方法,添加静态属性-----------------------');
  console.log();
  console.log((ProfileService as unknown as StaticUser).myinfo);
  const profile = new ProfileService();
  console.log((profile as any).userinfo);
  console.log();
  console.log('-----------------------示例4:执行完毕-----------------------');
};
// 打印静态属性则控制台输出 myinfo .133.zhejiang
// 控制台输出 contruct has been changed
// 控制台输出 .133.zhejiang
