const HelloDerorator = <T extends new (...args: any[]) => any>(constructor: T) => {
  return class extends constructor {
    newProperty = 'new property';

    hello = 'override';

    sayHello() {
      return this.hello;
    }
  };
};

@HelloDerorator
export class Hello {
  [key: string]: any; // 此处用于防止eslint提示sayHello方法不存在

  hello: string;

  constructor() {
    this.hello = 'test';
  }
}

export const exp2 = () => {
  console.log('-----------------------示例2:简单的类装饰器-----------------------');
  console.log('-----------------------动态添加一个sayHello方法以及覆盖hello的值-----------------------');
  console.log();
  const hello = new Hello();
  console.log(hello.hello);
  console.log(hello.newProperty);
  console.log(hello.sayHello());

  console.log();
  console.log('-----------------------示例2:执行完毕-----------------------');
};

// 控制台打印 override
