import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { correlationIdStorage } from '../context/correlation-id.context';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  private readonly correlationIdHeader = 'x-correlation-id';

  use(req: Request, res: Response, next: NextFunction) {
    // Get existing correlation ID from request or generate a new one
    const correlationId =
      req.headers[this.correlationIdHeader]?.toString() || randomUUID();

    // Store in AsyncLocalStorage for the entire request lifecycle
    correlationIdStorage.run({ correlationId }, () => {
      // Add to request headers for backward compatibility
      req.headers[this.correlationIdHeader] = correlationId;

      // Add to response headers
      res.setHeader(this.correlationIdHeader, correlationId);

      next();
    });
  }
}
