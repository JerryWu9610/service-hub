import { Injectable } from '@nestjs/common';
import gm from 'gm';
import { HandleImgParams } from './types';

@Injectable()
export class GmService {
  async handleImg({ data, type, commands }: HandleImgParams): Promise<Buffer> {
    const dataBuf = Buffer.from(data, 'base64');
    let instance = gm(dataBuf, type);

    commands.forEach((command) => {
      const [methodName, argsStr] = command.match(/^\w+|\(.*\)$/g);
      const args: any[] = JSON.parse(`[${argsStr.slice(1, -1)}]`);

      if (typeof instance[methodName] === 'function') {
        instance = instance[methodName](...args);
      }
    });

    return new Promise<Buffer>((resolve, reject) => {
      instance.toBuffer((err, buffer) => {
        if (err) reject(err);
        else resolve(buffer);
      });
    });
  }
}
