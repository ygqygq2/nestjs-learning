import { Module } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { WinstonModule, WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';
import { Console } from 'winston/lib/winston/transports';

import { LogEnum } from '../enum/config.enum';

function createDailyRotateTransport(level: string, filename: string) {
  return {
    level,
    dirname: 'logs',
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
  };
}

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const consoleTransports = new Console({
          level: configService.get(LogEnum.LOG_LEVEL),
          format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike()),
        });

        return {
          transports: [
            consoleTransports,
            ...(configService.get(LogEnum.LOG_ON)
              ? [createDailyRotateTransport('info', 'application'), createDailyRotateTransport('error', 'error')]
              : []),
          ],
        } as WinstonModuleOptions;
      },
    }),
  ],
})
export class LogsModule {}
