import { ExecutionContext, NestInterceptor, Injectable, CallHandler } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before Interceptor...');
    return next.handle().pipe(
      map((data) => {
        console.log('After Interceptor...');
        // return data;
        return plainToInstance(this.dto, data, {
          // 设置为 true 之后，所有经过该拦截器的接口都需要设置 Expose 或 Exclude
          // Expose 就是用来暴露的，Exclude 就是用来排除的
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
