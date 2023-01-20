import { Global, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Logs } from '@/logs/logs.entity';

import { Roles } from '@/roles/roles.entity';

import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Logs, Roles])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
