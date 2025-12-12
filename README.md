# NestJS Study

A learning and reference project exploring various NestJS concepts, patterns, and best practices.

## 📦 Currently Implemented

### Middleware

**Correlation ID Middleware** - Adds a unique request ID to each request for distributed tracing. Uses existing `x-correlation-id` header if provided, otherwise generates a new UUID. Runs early in the request lifecycle, making the correlation ID available to all components.

### Interceptors

**Performance Interceptor** - Monitors endpoint response times and logs warnings for slow requests.
**Retry Interceptor** - Automatically retries failed requests with exponential backoff (1s, 2s, 4s, etc.).

All interceptors are registered only on the routes they are applied to.

## 🚀 Quick Start

```bash
yarn install
yarn start:dev
```

### Configuration

Create a `.env` file:

```env
PORT=3000
SLOW_RESPONSE_THRESHOLD=500
MAX_RETRIES=3
RETRY_DELAY=1000
```

## 📝 Example Endpoints

- `GET /` - Basic endpoint
- `GET /slow` - Simulates slow response (>500ms)
- `GET /error` - Demonstrates retry behavior
- `GET /fast` - Normal fast response
- `GET /correlation-id` - Returns the correlation ID for the current request

## 🏗️ Project Structure

```
src/
├── middleware/
│   └── correlation-id.middleware.ts
├── interceptors/
│   ├── performance.interceptor.ts
│   └── retry.interceptor.ts
├── app.controller.ts
├── app.module.ts
├── main.ts
└── README.md
```

## 📖 Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [RxJS Documentation](https://rxjs.dev/)
