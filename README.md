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

## API Reference

### `setupOTelSDK(collectorAddress: string)`

Initialize OTEL SDK with Trace, Metric, and Log providers + Document Load instrumentation.

```typescript
import { setupOTelSDK } from '@makomweb/otel-sdk-react';

setupOTelSDK('http://localhost:4318');
```

### `setupFetchInstrumentation(backendUrl: string)`

Trace HTTP requests with W3C Trace Context propagation to your backend.

```typescript
import { setupFetchInstrumentation } from '@makomweb/otel-sdk-react';

setupFetchInstrumentation('http://api.example.com');
```

## Usage

### Basic Setup

In your `main.tsx` or `main.jsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { setupOTelSDK, setupFetchInstrumentation } from '@makomweb/otel-sdk-react';

import App from './App';

// Initialize OTEL (required, before React renders)
setupOTelSDK('http://localhost:4318');

// Optional: enable fetch tracing
setupFetchInstrumentation('http://localhost:8081');

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### With Environment Variables

Create `.env.local`:
```bash
VITE_OTEL_COLLECTOR_ADDRESS=http://localhost:4318
VITE_BACKEND_API_URL=http://localhost:8081
```

Then in `main.tsx`:
```typescript
setupOTelSDK(import.meta.env.VITE_OTEL_COLLECTOR_ADDRESS);
setupFetchInstrumentation(import.meta.env.VITE_BACKEND_API_URL);
```

### Advanced: Config Module

For larger applications, organize configuration separately:

```typescript
// config.ts
export function getConfig() {
  return {
    otelCollectorAddress: import.meta.env.VITE_OTEL_COLLECTOR_ADDRESS || 'http://localhost:4318',
    apiUrl: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8081',
  };
}
```

```typescript
// main.tsx
import { setupOTelSDK, setupFetchInstrumentation } from '@makomweb/otel-sdk-react';
import { getConfig } from './config';

const config = getConfig();
setupOTelSDK(config.otelCollectorAddress);
setupFetchInstrumentation(config.apiUrl);
```

## Troubleshooting

### Spans not appearing in collector?

1. **Verify setupOTelSDK() is called before React renders** (must be first in main.tsx)
2. **Check collector is running**: `curl http://localhost:4318/v1/traces -X POST`
3. **Check network in DevTools**: Look for requests to `/v1/traces` endpoint

### FetchInstrumentation not tracing requests?

1. **Verify setupFetchInstrumentation(backendUrl) is called**
2. **Check backendUrl matches your API domain**
3. **Check CORS headers**: Collector must accept cross-origin requests

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)
