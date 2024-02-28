import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import lodash from 'lodash';
import { createWorker } from 'tesseract.js';
import type { Worker } from 'tesseract.js';
import { RecognizeAlphanumericParams, RecognizeResult } from './types';

@Injectable()
export class TesseractService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {}

  private workers: Worker[] = [];
  private idleWorkerSet: Set<Worker> = new Set();
  private waitingQueue: {
    resolve: (result: any) => void;
    callback: (worker: Worker) => Promise<any>;
  }[] = [];

  async recognizeAlphanumeric({
    data,
    params,
  }: RecognizeAlphanumericParams): Promise<RecognizeResult> {
    return await this.execJob(async (worker) => {
      await worker.setParameters(params);
      const buffer = Buffer.from(data, 'base64');
      const recognizeResult = (await worker.recognize(buffer)).data;
      return lodash.pick(recognizeResult, [
        'text',
        'version',
        'psm',
        'oem',
        'confidence',
      ]);
    });
  }

  async onModuleInit() {
    const numWorkers = this.configService.get<number>('tesseract.numWorkers');
    for (let i = 0; i < numWorkers; i++) {
      const worker = await createWorker('eng');
      this.workers.push(worker);
      this.idleWorkerSet.add(worker);
    }
  }

  async onModuleDestroy() {
    await Promise.all(this.workers.map((worker) => worker.terminate()));
    this.workers = [];
    this.idleWorkerSet.clear();
  }

  private async execJob(
    callback: (worker: Worker) => Promise<any>,
  ): Promise<any> {
    if (!this.idleWorkerSet.size) {
      return new Promise<any>((resolve) => {
        this.waitingQueue.push({
          resolve,
          callback,
        });
      });
    }
    const worker = this.idleWorkerSet.values().next().value;
    this.idleWorkerSet.delete(worker);
    const result = await callback(worker);
    this.idleWorkerSet.add(worker);
    process.nextTick(() => this.tryExecWaitingJob());
    return result;
  }

  private async tryExecWaitingJob() {
    if (this.idleWorkerSet.size && this.waitingQueue.length) {
      const { resolve, callback } = this.waitingQueue.shift();
      const worker = this.idleWorkerSet.values().next().value;
      this.idleWorkerSet.delete(worker);
      resolve(await callback(worker));
      this.idleWorkerSet.add(worker);
    }
  }
}
