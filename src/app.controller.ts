import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello from NestJS Study!';
  }

  @Get('slow')
  async getSlow(): Promise<string> {
    // Simulate slow operation
    await new Promise((resolve) => setTimeout(resolve, 600));
    return 'This endpoint is intentionally slow (>500ms)';
  }

  @Get('error')
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
