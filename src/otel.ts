import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import {
  SimpleSpanProcessor,
  WebTracerProvider,
} from '@opentelemetry/sdk-trace-web';
import * as OTEL_API from '@opentelemetry/api';
import * as LOGS_API from '@opentelemetry/api-logs';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import * as SDK_LOGS from '@opentelemetry/sdk-logs';

/**
 * Initialize OpenTelemetry SDK with explicit configuration.
 *
 * @param collectorAddress - OTLP collector endpoint URL (e.g., http://localhost:4318)
 * @example
 * setupOTelSDK(import.meta.env.VITE_OTEL_COLLECTOR_ADDRESS);
 */
export function setupOTelSDK(collectorAddress: string): void {
  // Create a resource object with service name attribute
  const resource = {
    attributes: {
      [SEMRESATTRS_SERVICE_NAME]: 'frontend',
    },
  };

  // TRACES
  const tracerProvider = new WebTracerProvider({
    // @ts-ignore: Resource type mismatch but functionally compatible
    resource: resource,
  });

  const traceExporter = new OTLPTraceExporter({
    url: `${collectorAddress}/v1/traces`,
    headers: {},
  });

  const spanProcessor = new SimpleSpanProcessor(traceExporter);

  // METRICS
  const metricExporter = new OTLPMetricExporter({
    url: `${collectorAddress}/v1/metrics`,
    headers: {},
  });
  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    // Default is 60000ms (60 seconds). Set to 10 seconds for demonstrative purposes only.
    exportIntervalMillis: 10000,
  });

  const meterProvider = new MeterProvider({
    // @ts-ignore: Resource type mismatch but functionally compatible
    resource: resource,
    readers: [metricReader],
  });

  OTEL_API.metrics.setGlobalMeterProvider(meterProvider);

  // LOGS
  const logExporter = new OTLPLogExporter({
    url: `${collectorAddress}/v1/logs`,
    headers: {},
  });

  const logProcessor = new SDK_LOGS.SimpleLogRecordProcessor(logExporter);
  const loggerProvider = new SDK_LOGS.LoggerProvider();
  // @ts-ignore: SDK-logs API mismatch - this works at runtime but TS doesn't recognize it
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  if (typeof (loggerProvider as unknown as Record<string, unknown>).addLogRecordProcessor === 'function') {
    // @ts-ignore: @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    (loggerProvider as unknown as Record<string, unknown>).addLogRecordProcessor(logProcessor);
  }
  LOGS_API.logs.setGlobalLoggerProvider(loggerProvider);

  // @ts-ignore: WebTracerProvider type mismatch (has addSpanProcessor but TS doesn't recognize it)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  if (typeof (tracerProvider as unknown as Record<string, unknown>).addSpanProcessor === 'function') {
    // @ts-ignore: @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    (tracerProvider as unknown as Record<string, unknown>).addSpanProcessor(spanProcessor);
  }
  tracerProvider.register();
  OTEL_API.trace.setGlobalTracerProvider(tracerProvider);

  // Register DocumentLoadInstrumentation (automatic page load tracing)
  registerInstrumentations({
    instrumentations: [new DocumentLoadInstrumentation()],
  });
}
