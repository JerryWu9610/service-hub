export type IConfig = {
  app: IAPPConfig;
  swagger: ISwaggerConfig;
};

export type IAPPConfig = {
  port: number;
  fallbackLanguage: string;
  mode: 'production' | 'development';
};

export type ISwaggerConfig = {
  enabled: boolean;
  path: string;
  title: string;
  description: string;
  version: string;
};
