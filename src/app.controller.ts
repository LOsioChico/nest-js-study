import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { PerformanceInterceptor } from './interceptors/performance.interceptor';
import { RetryInterceptor } from './interceptors/retry.interceptor';
import { getCorrelationId } from './context/correlation-id.context';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello from NestJS Study!';
  }

  @Get('slow')
  @UseInterceptors(PerformanceInterceptor)
  async getSlow(): Promise<string> {
    // Simulate slow operation
    await new Promise((resolve) => setTimeout(resolve, 600));
    return 'This endpoint is intentionally slow (>500ms)';
  }

  @Get('error')
  @UseInterceptors(RetryInterceptor)
  getError(): never {
    // This will trigger retry interceptor
    throw new HttpException(
      'Simulated error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Get('correlation-id')
  getCorrelationId() {
    // Access correlation ID from AsyncLocalStorage
    // This is a test to ensure the correlation ID is available in the AsyncLocalStorage
    // This can be accessed in any part of the application
    const correlationId = getCorrelationId();
    return {
      correlationId: correlationId,
      message: 'Correlation ID accessed via AsyncLocalStorage',
    };
  }
}
