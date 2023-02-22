import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { MenusController } from './menus.controller';
import { Menus } from './menus.entity';
import { MenusService } from './menus.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menus])],
  providers: [MenusService],
  controllers: [MenusController],
})
export class MenusModule {}
