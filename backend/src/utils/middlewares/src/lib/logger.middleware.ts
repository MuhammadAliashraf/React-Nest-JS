import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private loggers = new Logger('HTTPLogger');

  use(req: Request, res: Response, next: NextFunction) {
    const startAt = process.hrtime();
    const { method, originalUrl, ip, params, query } = req;
    const userAgent = req.get('user-agent') || '';

    this.loggers.debug(`USER-AGENT => ${userAgent} from ${ip}`);

    this.loggers.debug(
      `REQUEST => ${method} ${originalUrl} ${JSON.stringify(
        params,
      )} ${JSON.stringify(query)}`,
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const diff = process.hrtime(startAt);

      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      this.loggers.debug(
        `RESPONSE => ${method} ${originalUrl} ${statusCode} ${responseTime}ms ${contentLength}`,
      );
    });

    next();
  }
}
