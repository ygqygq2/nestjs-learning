import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseFilters, UseInterceptors } from '@nestjs/common';

import { TypeormFilter } from '@/filters/typeorm.filter';

import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';

// export function TypeOrmDecorator() {
//   return UseFilters(new TypeormFilter());
// }

@Controller('auth')
// @TypeOrmDecorator()
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  getHello(): string {
    return 'Auth';
  }

  @Post('/signin')
  async signin(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    const token = await this.authService.signin(username, password);
    return {
      access_token: token,
    };
    // return this.authService.signin(username, password);
  }

  @Post('/signup')
  signup(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    return this.authService.signup(username, password);
  }
}
