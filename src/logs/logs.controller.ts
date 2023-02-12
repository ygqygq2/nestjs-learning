import { Body, Controller, Get, Post } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { Serialize } from '@/decorators/serialize.decorator';

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
// @UseGuards(JwtGuard, AdminGuard)
export class LogsController {
  @Get()
  getTest() {
    return 'test';
  }

  @Post()
  @Serialize(PublicLogsDto)
  // @UseInterceptors(new SerializeInterceptor(PublicLogsDto))
  postTest(@Body() dto: LogsDto) {
    console.log('🚀 ~ file: logs.controller.ts~ line 15~ LogsController~ postTest~ dto', dto);
    return dto;
  }
}
