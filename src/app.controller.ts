import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { PerformanceInterceptor } from './interceptors/performance.interceptor';
import { RetryInterceptor } from './interceptors/retry.interceptor';

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

  @Get('fast')
  getFast(): string {
    return 'This endpoint responds quickly';
  }
}
