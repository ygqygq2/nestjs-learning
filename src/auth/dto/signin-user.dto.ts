import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SigninUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    // $value: 当前用户传入的值
    // $property: 当前验证的属性名
    // $target: 当前验证的对象
    // $constraint1: 当前验证的规则
    message: `用户名长度必须在 $constraint1 到 $constraint2 之间，当前传递的值是：$value`,
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 64)
  password: string;
}
