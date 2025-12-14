import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PerformanceInterceptor } from './interceptors/performance.interceptor';
import { RetryInterceptor } from './interceptors/retry.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { getCorrelationId } from './context/correlation-id.context';
import {
  dataSource,
  RegisterDto,
} from './validators/is-unique-email.validator';
import { ParsePositiveIntPipe } from './pipes/parse-positive-int.pipe';

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

  @Get('filter')
  @UseFilters(HttpExceptionFilter)
  testErrors(@Query('type') type?: string): never {
    // Returns different types of errors based on query parameter
    switch (type) {
      case 'not-found':
        throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
      case 'bad-request':
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      case 'unauthorized':
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      case 'forbidden':
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      case 'server-error':
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      default:
        throw new HttpException(
          'Invalid error type. Use ?type=not-found|bad-request|unauthorized|forbidden|server-error|unhandled',
          HttpStatus.BAD_REQUEST,
        );
    }
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

  @Post('register')
  @UsePipes(ValidationPipe)
  register(@Body() body: RegisterDto) {
    dataSource.push(body.email);
    return `Registered ${body.email}`;
  }

  @Get('parse-int')
  @UsePipes(ParsePositiveIntPipe)
  parseInt(@Query('id') id: number) {
    return {
      id,
      message: 'Parsed ID',
      type: typeof id,
    };
  }
}
