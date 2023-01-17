import { Controller, Delete, Get, Post } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService, protected configService: ConfigService) {}

  @Get()
  getlogss(): any {
    return this.logsService.findAll();
    // return this.logsService.getlogss();
  }

  @Post()
  addlogs(): any {
    const logs = {
      path: '/api/user',
      data: { username: 'ygqygq2', password: '123456' },
      userId: 2,
      method: 'post',
      result: '201',
    } as logs;
    return this.logsService.create(logs);
    // return this.logsService.addlogs();
  }

  @Delete()
  removelogs(): any {
    return this.logsService.remove(1);
  }

  @Get('/logs')
  getUserLogs(): any {
    return this.logsService.findProfile(2);
  }

  @Get('/logsByGroup')
  async getLogsByGroup(): Promise<any> {
    const res = this.logsService.findLogsByGroup(2);
    return res.map((o) => ({
      result: o.result,
      count: o.count,
    }));
  }
}
