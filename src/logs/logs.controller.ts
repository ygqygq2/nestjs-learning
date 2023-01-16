import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

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
    const logs = { logsname: 'ygqygq2', password: '123456' } as logs;
    return this.logsService.create(logs);
    // return this.logsService.addlogs();
  }

  @Patch()
  updatelogs(): any {
    return this.logsService.update(1, { logsname: 'ygqygq2', password: 'ygqygq2' });
  }

  @Delete()
  removelogs(): any {
    return this.logsService.remove(1);
  }

  @Get('/profile')
  getlogsProfile(): any {
    return this.logsService.findProfile(2);
  }
}
