// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";
import {
  createServerResource,
  DEFAULT_METRIC_EXPORT_INTERVAL_MILLIS,
  resolveMetricExportIntervalMillis,
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

Tinytest.add('opentelemetry - server resource has a unique instance id', function (test) {
  const detectedAttributes = createServerResource({ 'service.name': 'engine' }).attributes;
  test.equal(detectedAttributes['service.name'], 'engine');
  test.isTrue(
    typeof detectedAttributes['service.instance.id'] === 'string' &&
      detectedAttributes['service.instance.id'].length > 0
  );
  test.equal(
    createServerResource({ 'service.instance.id': 'configured-instance' }).attributes[
      'service.instance.id'
    ],
    'configured-instance'
  );
});
