import { Controller, Get, Post } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { Logs } from './logs.entity';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService, protected configService: ConfigService) {}

  @Get()
  getLogs(): any {
    return this.logsService.findAll();
  }

  @Post()
  addlogs(): any {
    const logsTmp = {
      path: '/api/user',
      data: '测试日志',
      user: { username: 'ygqygq2', password: '123456' },
      method: 'post',
      result: 201,
    } as Logs;
    return this.logsService.create(logsTmp);
  }

  @Get('/logsByGroup')
  async getLogsByGroup(): Promise<any> {
    const res = this.logsService.findLogsByGroup(2);
    return (await res).map((o) => ({
      result: o.result,
      count: o.count,
    }));
  }
}
