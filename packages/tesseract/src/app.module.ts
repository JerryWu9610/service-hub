import path from 'path';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  I18nYamlLoader,
} from 'nestjs-i18n';
import { getConfig } from '@/config';
import { ResponseInterceptor } from '@/response';
import { AllExceptionFilter, BusinessException } from './exception';
import { TesseractModule } from './modules/tesseract/tesseract.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig],
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get('app.fallbackLanguage'),
        loaderOptions: {
          path: path.join(__dirname, 'i18n'),
          watch: true,
        },
      }),
      loader: I18nYamlLoader,
      resolvers: [AcceptLanguageResolver, new HeaderResolver(['x-lang'])],
      inject: [ConfigService],
    }),
    TesseractModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          whitelist: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
          exceptionFactory: (errors) => {
            return new BusinessException({
              errorCode: 'VALIDATION_ERROR',
              message: errors
                .map((error) => {
                  if (error.constraints) {
                    return Object.values(error.constraints).join('; ');
                  }
                  return '';
                })
                .filter(Boolean)
                .join('; '),
            });
          },
        }),
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
