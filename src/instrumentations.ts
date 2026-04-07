import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

/**
 * Set up Fetch instrumentation to trace HTTP requests with W3C Trace Context propagation.
 *
 * This function enables automatic span creation for fetch requests to your backend API
 * and injects the traceparent header for distributed tracing context propagation.
 *
 * @param backendUrl - The backend API URL pattern to match for header propagation
 * @example
 * setupFetchInstrumentation('http://localhost:8081');
 * setupFetchInstrumentation('https://api.example.com');
 */
export function setupFetchInstrumentation(backendUrl: string): void {
  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: [
          new RegExp(`${backendUrl.replace(/\//g, '\\/')}\\/.*`),
        ],
      }),
    ],
  });
}
