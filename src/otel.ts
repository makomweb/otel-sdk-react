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
import { OTEL_COLLECTOR_ADDRESS } from './env';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Resource } = require('@opentelemetry/resources');

export function setupOTelSDK(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const resource = Resource.default().merge(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    new Resource({
      [SEMRESATTRS_SERVICE_NAME]: 'frontend',
    }),
  );

  // TRACES
  const tracerProvider = new WebTracerProvider({
    resource: resource,
  });

  const traceExporter = new OTLPTraceExporter({
    url: `${OTEL_COLLECTOR_ADDRESS}/v1/traces`,
    headers: {},
  });

  const spanProcessor = new SimpleSpanProcessor(traceExporter);

  // METRICS
  const metricExporter = new OTLPMetricExporter({
    url: `${OTEL_COLLECTOR_ADDRESS}/v1/metrics`,
    headers: {},
  });
  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    // Default is 60000ms (60 seconds). Set to 10 seconds for demonstrative purposes only.
    exportIntervalMillis: 10000,
  });

  const meterProvider = new MeterProvider({
    resource: resource,
    readers: [metricReader],
  });

  OTEL_API.metrics.setGlobalMeterProvider(meterProvider);

  // LOGS
  const logExporter = new OTLPLogExporter({
    url: `${OTEL_COLLECTOR_ADDRESS}/v1/logs`,
    headers: {},
  });

  const logProcessor = new SDK_LOGS.SimpleLogRecordProcessor(logExporter);
  const loggerProvider = new SDK_LOGS.LoggerProvider();
  // @ts-ignore: SDK-logs type mismatch (SDK-logs has addLogRecordProcessor but TS doesn't recognize it)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  loggerProvider.addLogRecordProcessor(logProcessor);
  LOGS_API.logs.setGlobalLoggerProvider(loggerProvider);

  // @ts-ignore: WebTracerProvider type mismatch (has addSpanProcessor but TS doesn't recognize it)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  tracerProvider.addSpanProcessor(spanProcessor);
  tracerProvider.register();
  OTEL_API.trace.setGlobalTracerProvider(tracerProvider);

  // Register DocumentLoadInstrumentation (automatic page load tracing)
  registerInstrumentations({
    instrumentations: [new DocumentLoadInstrumentation()],
  });
}
