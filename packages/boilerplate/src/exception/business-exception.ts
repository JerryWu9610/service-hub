import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor({ errorCode, message }: { errorCode: string; message: string }) {
    super(message, HttpStatus.BAD_REQUEST);
    this.errorCode = errorCode;
  }

  private readonly errorCode: string;

  getErrorCode() {
    return this.errorCode;
  }
}
