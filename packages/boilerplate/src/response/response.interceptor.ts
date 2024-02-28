import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs';
import { IGNORE_FORMAT_KEY } from './ignore-format.decorator';
import { StandardCtrlReturn } from './standard-ctrl-return';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const isExclude = this.reflector.get<boolean>(
      IGNORE_FORMAT_KEY,
      context.getHandler(),
    );
    if (isExclude) {
      return next.handle();
    }
    return next.handle().pipe(
      map((ctrlReturn) => {
        let message = '';
        let data = ctrlReturn;
        if (ctrlReturn instanceof StandardCtrlReturn) {
          message = ctrlReturn.message;
          data = ctrlReturn.data;
        }
        return {
          code: 'OK',
          message,
          data,
        };
      }),
    );
  }
}
