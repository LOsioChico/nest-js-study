import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);
  private readonly slowThreshold: number;

  constructor(private readonly configService: ConfigService) {
    this.slowThreshold = this.configService.get<number>(
      'SLOW_RESPONSE_THRESHOLD',
      500,
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now();
    const req = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;
          if (duration > this.slowThreshold) {
            this.logger.warn(
              `Slow endpoint: ${req.method} ${req.url} - ${duration}ms`,
            );
          }
        },
        error: () => {
          const duration = Date.now() - start;
          if (duration > this.slowThreshold) {
            this.logger.error(
              `Slow endpoint (failed): ${req.method} ${req.url} - ${duration}ms`,
            );
          }
        },
      }),
    );
  }
}
