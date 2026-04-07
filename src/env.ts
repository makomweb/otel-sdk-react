/**
 * Configuration for OpenTelemetry Collector address.
 *
 * Reads from window.OTEL_COLLECTOR_ADDRESS (set in index.html before app loads)
 * or defaults to localhost:4318 for local development.
 */
export const OTEL_COLLECTOR_ADDRESS =
  // @ts-ignore: window type doesn't have OTEL_COLLECTOR_ADDRESS but it's set in index.html
  (typeof window !== 'undefined' && window.OTEL_COLLECTOR_ADDRESS) ||
  'http://localhost:4318';
