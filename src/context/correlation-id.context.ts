import { AsyncLocalStorage } from 'node:async_hooks';
import { HttpException, HttpStatus } from '@nestjs/common';

interface CorrelationContext {
  correlationId: string;
}

export const correlationIdStorage = new AsyncLocalStorage<CorrelationContext>();

export function getCorrelationId(): string {
  const store = correlationIdStorage.getStore();
  // This should never happen
  if (!store) {
    throw new HttpException(
      'Correlation ID not found',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  return store.correlationId;
}
