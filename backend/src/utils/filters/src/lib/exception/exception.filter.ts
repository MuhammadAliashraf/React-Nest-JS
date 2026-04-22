import { PayloadDto } from '@utils/data-transfer-objects';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

export const getStatusCode = <T>(exception: T): number => {
  return exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
};

export const getErrorMessage = <T>(exception: T): string => {
  return exception instanceof HttpException
    ? exception.message
    : String(exception);
};

export const getStackTrace = <T>(exception: T): string | undefined => {
  return exception instanceof HttpException
    ? exception.stack
    : String(exception);
};

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  logger: Logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();
    const request = ctx.getRequest<any>();
    const statusCode = getStatusCode<T>(exception);
    const message =
      typeof exception.response === 'object'
        ? exception.response['message']?.toString()?.replace(/\n/g, '')
        : getErrorMessage<T>(exception).replace(/\n/g, '');

    const user = request.user as PayloadDto;

    this.logger.error(`EXCEPTION => ${JSON.stringify(exception, null, 2)}`);

    const res = {
      success: false,
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      exception: process.env['NODE_ENV'] === 'production' ? null : exception,
      requestor: user,
    };

    this.logger.error(`EXCEPTION => ${JSON.stringify(res, null)}`);

    response.status(statusCode).json(res);
  }
}
