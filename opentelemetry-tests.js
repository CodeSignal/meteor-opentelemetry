// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";
import {
  DEFAULT_METRIC_EXPORT_INTERVAL_MILLIS,
  resolveMetricExportIntervalMillis,
  resolveServerResourceAttributes,
} from './metrics-config';

// Import and rename a variable exported by opentelemetry.js.
import { name as packageName } from "meteor/codesignal:opentelemetry";

// Write your tests here!
// Here is an example.
Tinytest.add('opentelemetry - example', function (test) {
  test.equal(packageName, "opentelemetry");
});

Tinytest.add('opentelemetry - metric export interval defaults and validates', function (test) {
  test.equal(
    resolveMetricExportIntervalMillis(undefined),
    DEFAULT_METRIC_EXPORT_INTERVAL_MILLIS
  );
  test.equal(resolveMetricExportIntervalMillis(15_000), 15_000);
  test.equal(resolveMetricExportIntervalMillis('15000'), 15_000);
  test.throws(() => resolveMetricExportIntervalMillis(0));
  test.throws(() => resolveMetricExportIntervalMillis(Number.NaN));
});

Tinytest.add('opentelemetry - server resource attributes use hostname as instance id', function (test) {
  test.equal(
    resolveServerResourceAttributes({ 'service.name': 'engine' }, 'engine-pod-1'),
    {
      'service.name': 'engine',
      'service.instance.id': 'engine-pod-1',
    }
  );
  test.equal(
    resolveServerResourceAttributes(
      { 'service.instance.id': 'configured-instance' },
      'engine-pod-1'
    )['service.instance.id'],
    'configured-instance'
  );
});
