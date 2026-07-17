import { type Attributes } from '@opentelemetry/api';

export const DEFAULT_METRIC_EXPORT_INTERVAL_MILLIS = 60_000;

export function resolveMetricExportIntervalMillis(value: unknown): number {
  if (value === undefined) {
    return DEFAULT_METRIC_EXPORT_INTERVAL_MILLIS;
  }

  const numericValue = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (
    typeof numericValue !== 'number' ||
    !Number.isFinite(numericValue) ||
    numericValue <= 0
  ) {
    throw new Error('metricExportIntervalMillis must be a finite number greater than 0');
  }

  return numericValue;
}

export function resolveServerResourceAttributes(
  configuredAttributes: Attributes | undefined,
  hostname: string | undefined
): Attributes {
  const attributes = { ...configuredAttributes };

  if (hostname && attributes['service.instance.id'] === undefined) {
    attributes['service.instance.id'] = hostname;
  }

  return attributes;
}
