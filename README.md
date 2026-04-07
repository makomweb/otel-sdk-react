# @makomweb/otel-sdk-react

A minimal, production-ready OpenTelemetry SDK for React applications. Provides core OTEL setup with optional fetch instrumentation for tracing backend API calls.

## Features

✅ **Web Trace Provider** - Distributed tracing with OTLP HTTP exporter
✅ **Metrics** - Application metrics with OTLP HTTP exporter
✅ **Logs** - Structured logging with OTLP HTTP exporter
✅ **Document Load Instrumentation** - Automatic page load tracing
✅ **Fetch Instrumentation** - Optional: Trace HTTP requests with W3C Trace Context propagation
✅ **TypeScript** - Full type safety (strict mode)
✅ **Lightweight** - Minimal dependencies, tree-shakeable

## Installation

```bash
npm install @makomweb/otel-sdk-react
```

**Peer dependencies** (should already be in your project):
```json
{
  "react": ">=18.0.0",
  "@opentelemetry/api": ">=1.7.0",
  "@opentelemetry/sdk-trace-web": ">=1.17.0",
  "@opentelemetry/sdk-metrics": ">=1.17.0",
  "@opentelemetry/sdk-logs": ">=0.50.0",
  "@opentelemetry/exporter-trace-otlp-http": ">=0.43.0",
  "@opentelemetry/exporter-metrics-otlp-http": ">=0.43.0",
  "@opentelemetry/exporter-logs-otlp-http": ">=0.50.0",
  "@opentelemetry/instrumentation": ">=0.43.0",
  "@opentelemetry/instrumentation-fetch": ">=0.51.0",
  "@opentelemetry/instrumentation-document-load": ">=0.33.0"
}
```

## Quick Start

### 1. Set up OTEL SDK (before React renders)

In your `main.tsx` or `main.jsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { setupOTelSDK } from '@makomweb/otel-sdk-react';

import App from './App';

// Initialize OTEL infrastructure with explicit collector address
setupOTelSDK(import.meta.env.VITE_OTEL_COLLECTOR_ADDRESS || 'http://localhost:4318');

// Then render React
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### 2. (Optional) Enable fetch tracing with context propagation

```typescript
import { setupOTelSDK, setupFetchInstrumentation } from '@makomweb/otel-sdk-react';
import { BACKEND_API_URL } from './config';

// Initialize core OTEL
setupOTelSDK(import.meta.env.VITE_OTEL_COLLECTOR_ADDRESS || 'http://localhost:4318');

// Optional: trace backend API calls
setupFetchInstrumentation(BACKEND_API_URL);
```

### 3. Configure via environment variables

Create `.env.local`:

```bash
VITE_OTEL_COLLECTOR_ADDRESS=http://localhost:4318
VITE_BACKEND_API_URL=http://localhost:8081
```

Or for production:

```bash
VITE_OTEL_COLLECTOR_ADDRESS=https://otel-collector.production.example.com:4318
VITE_BACKEND_API_URL=https://api.production.example.com
```

## API Reference

### `setupOTelSDK()`

Initializes the OpenTelemetry SDK with:
- Web Trace Provider (OTLP exporter)
- Meter Provider (OTLP exporter)
- Logger Provider (OTLP exporter)
- Document Load Instrumentation (automatic page load tracing)

```typescript
import { setupOTelSDK } from '@makomweb/otel-sdk-react';

setupOTelSDK();
```

**Configuration**:
- `OTEL_COLLECTOR_ADDRESS`: Where to send telemetry (default: `http://localhost:4318`)

### `setupFetchInstrumentation(backendUrl: string)`

Enables tracing of fetch requests to your backend API with W3C Trace Context propagation.

```typescript
import { setupFetchInstrumentation } from '@makomweb/otel-sdk-react';

setupFetchInstrumentation('http://api.example.com');
```

**What it does**:
- Automatically creates spans for all fetch requests
- Injects `traceparent` header (W3C Trace Context)
- Only propagates to URLs matching the backend URL pattern
- Prevents header injection to third-party domains (security)

## Architecture

### Scope: Infrastructure Only

This package handles **observability infrastructure**:
- OTEL SDK initialization
- Collector endpoint configuration
- Transport layer (OTLP HTTP)

### What You Provide: Application Configuration

Your application is responsible for:
- Backend API URL (where to send traces)
- Custom instrumentation (business logic to trace)
- Application-specific configuration

### Why This Separation?

✅ **Reusable**: Works with any React app (not tied to specific backends)
✅ **Testable**: Easier to test in isolation
✅ **Flexible**: Applications control their own tracing strategy
✅ **Maintainable**: Clear separation of concerns

## Example: Full Setup

```typescript
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { setupOTelSDK, setupFetchInstrumentation } from '@makomweb/otel-sdk-react';

import App from './App';
import { getConfig } from './config';

// Get app configuration (can come from anywhere: env vars, config files, computed)
const config = getConfig();

// Initialize OTEL with explicit collector address
setupOTelSDK(config.otelCollectorAddress);

// Then set up application-specific tracing
setupFetchInstrumentation(config.apiUrl);

// Finally render app
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

```typescript
// config.ts
export interface AppConfig {
  apiUrl: string;
  otelCollectorAddress: string;
}

export function getConfig(): AppConfig {
  return {
    apiUrl: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8081',
    otelCollectorAddress: import.meta.env.VITE_OTEL_COLLECTOR_ADDRESS || 'http://localhost:4318',
  };
}
```

```bash
# .env.local (development)
VITE_BACKEND_API_URL=http://localhost:8081
VITE_OTEL_COLLECTOR_ADDRESS=http://localhost:4318

# .env.production (production)
VITE_BACKEND_API_URL=https://api.production.example.com
VITE_OTEL_COLLECTOR_ADDRESS=https://otel.production.example.com:4318
```

## Troubleshooting

### Spans not appearing in collector?

1. **Check OTEL_COLLECTOR_ADDRESS is set**:
   ```javascript
   console.log(window.OTEL_COLLECTOR_ADDRESS);
   ```

2. **Check network in DevTools**: Look for requests to `/v1/traces` endpoint

3. **Check setupOTelSDK() is called before React renders**: It must be the first thing in main.tsx

4. **Check collector is running**: `curl http://localhost:4318/v1/traces -X POST`

### FetchInstrumentation not tracing requests?

1. **Verify setupFetchInstrumentation(backendUrl) is called**
2. **Check backendUrl matches your API domain**
3. **Check CORS headers**: Collector must accept cross-origin requests
4. **Check Network tab**: Spans should have `traceparent` header in requests

## License

MIT

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## Authors

- Created by makomweb
- Extracted from [fullstack-symfony-react](https://github.com/makomweb/fullstack-symfony-react)
