import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
  HttpException,
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { BusinessException } from './business-exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  catch(exception: any, host: ArgumentsHost) {
    const mappedException = this.exceptionMapping(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (mappedException instanceof BusinessException) {
      const status = mappedException.getStatus();
      response.status(status).json({
        code: mappedException.getErrorCode(),
        message: mappedException.message,
      });
      return;
    } else {
      Logger.error(exception.stack ?? exception);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: 'UNEXPECTED_ERROR',
        message: this.i18n.t('app.exception.fallback_message', {
          lang: I18nContext.current().lang,
        }),
      });
    }
  }

  private exceptionMapping(exception: any) {
    if (exception instanceof BusinessException) {
      return exception;
    }

    if (exception instanceof HttpException) {
      const res = exception.getResponse() as any;
      return new BusinessException({
        errorCode: (res.error ?? res.message ?? res)
          ?.split(' ')
          .join('_')
          .toUpperCase(),
        message: exception.message,
      });
    }

    return exception;
  }
}
