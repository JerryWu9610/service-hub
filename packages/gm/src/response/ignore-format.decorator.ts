import { SetMetadata } from '@nestjs/common';

export const IGNORE_FORMAT_KEY = 'IGNORE_FORMAT_KEY';

export const ExcludeInterceptor = () => SetMetadata(IGNORE_FORMAT_KEY, true);
