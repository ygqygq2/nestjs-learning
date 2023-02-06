import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

// import{ SerializeInterceptor} from '../interceptors/serialize.interceptor';

class LogsDto {
  @IsString()
  @IsNotEmpty()
  msg: string;

  @IsString()
  id: string;

  @IsString()
  name: string;
}

@Controller('logs')
export class LogsController {
  @Get()
  getTest() {
    return 'test';
  }

  @Post()
  // @UseInterceptors(new SerializeInterceptor(PublicLogsDto))
  postTest(@Body() dto: LogsDto) {
    console.log('🚀 ~ file: logs.controller.ts~ line 15~ LogsController~ postTest~ dto', dto);
    return dto;
  }
}
