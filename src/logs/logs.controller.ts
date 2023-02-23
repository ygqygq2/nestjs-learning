import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { Can, CheckPolices } from '@/decorators/casl.decorator';
import { Serialize } from '@/decorators/serialize.decorator';
import { Action } from '@/enum/action.enum';
import { AdminGuard } from '@/guards/admin.guard';
import { CaslGuard } from '@/guards/casl.guard';
import { JwtGuard } from '@/guards/jwt.guard';

import { Logs } from './logs.entity';

class LogsDto {
  @IsString()
  @IsNotEmpty()
  msg: string;

  @IsString()
  id: string;

  @IsString()
  name: string;
}

class PublicLogsDto {
  @Expose()
  msg: string;

  @Expose()
  name: string;
}

@Controller('logs')
@UseGuards(JwtGuard, AdminGuard, CaslGuard)
@CheckPolices((ability) => ability.can(Action.Read, Logs))
@Can(Action.Read, Logs)
export class LogsController {
  @Get()
  @Can(Action.Read, Logs)
  getTest() {
    return 'test';
  }

  @Post()
  @Can(Action.Create, Logs)
  @Serialize(PublicLogsDto)
  // @UseInterceptors(new SerializeInterceptor(PublicLogsDto))
  postTest(@Body() dto: LogsDto) {
    console.log('🚀 ~ file: logs.controller.ts~ line 15~ LogsController~ postTest~ dto', dto);
    return dto;
  }
}
