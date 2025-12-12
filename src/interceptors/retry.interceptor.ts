import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, Observable, retry, throwError, timer } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class RetryInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RetryInterceptor.name);
  private readonly maxRetries: number;
  private readonly delay: number;

  constructor(private readonly configService: ConfigService) {
    this.maxRetries = this.configService.get<number>('MAX_RETRIES', 3);
    this.delay = this.configService.get<number>('RETRY_DELAY', 1000);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;

    return next.handle().pipe(
      retry({
        count: this.maxRetries,
        delay: (error: unknown, retryCount: number) => {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          this.logger.warn(
            `Retry attempt ${retryCount}/${this.maxRetries} for ${method} ${url}: ${errorMessage}`,
          );
          // Exponential backoff: 1s, 2s, 4s, etc.
          return timer(Math.pow(2, retryCount - 1) * this.delay);
        },
      }),
      catchError((error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.error(`Failed endpoint: ${method} ${url}: ${errorMessage}`);
        return throwError(() => error);
      }),
    );
  }
}
