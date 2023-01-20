import { Controller, Get } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService, protected configService: ConfigService) {}

  @Get()
  getLogs(): any {
    return this.logsService.findAll();
  }
}
