import { type Attributes } from '@opentelemetry/api';
import {
  detectResources,
  resourceFromAttributes,
  serviceInstanceIdDetector,
  type Resource,
} from '@opentelemetry/resources';

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

export function createServerResource(configuredAttributes?: Attributes): Resource {
  const detectedResource = detectResources({ detectors: [serviceInstanceIdDetector] });
  return detectedResource.merge(resourceFromAttributes(configuredAttributes ?? {}));
}
