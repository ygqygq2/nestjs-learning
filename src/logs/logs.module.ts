import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { LogsController } from './logs.controller';
import { logs } from './logs.entity';
import { LogsService } from './logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([logs])],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
