import path from 'path';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import { merge } from 'lodash';
import { projectRoot } from '@/utils';
import { IConfig } from './types';

let configValue: IConfig | null = null;
export const getConfig = () => {
  if (!configValue) {
    configValue = yaml.load(
      fs.readFileSync(path.resolve(projectRoot, 'config.yml'), 'utf-8'),
    ) as IConfig;
    const overridePath = path.resolve(projectRoot, 'config.override.yml');
    if (fs.existsSync(overridePath)) {
      const overrideConfigValue = yaml.load(
        fs.readFileSync(overridePath, 'utf-8'),
      ) as IConfig;
      merge(configValue, overrideConfigValue);
    }
  }
  return configValue;
};
