import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, LoggerService } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import * as requestIp from 'request-ip';

@Catch() // 不设置参数，默认捕获所有异常
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService, private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message: string = exception['response'] || 'Internal Server Error';

    // 加入更多异常错误逻辑
    // if (exception instanceof QueryFailedError) {
    //   message= exception['message'];
    //   // if (exception.driverError.errno=== 1062) {
    //   //   message= '唯一索引冲突';
    //   // }
    // }

    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      // IP 信息
      ip: requestIp.getClientIp(request),
      exception: exception['name'],
      error: message,
    };

    this.logger.error('[ygqygq2]', responseBody);
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
