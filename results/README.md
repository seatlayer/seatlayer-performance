# Performance result format

The [14 September 100K browser benchmark](2026-09-14/century-100k-browser-benchmark.md)
summarizes five stadium and five arena desktop production-build runs.

One record describes one foreground run. Repetitions remain separate records so
the distribution captures ordinary and slower runs.

The interactive page downloads a
`seatlayer.browser-interaction-run.v1` record for its manual 30-second zoom and
pan sample. Validate that raw file against
[`browser-interaction-run.schema.json`](browser-interaction-run.schema.json).
The broader renderer and simultaneous-viewer studies use
[`run-manifest.schema.json`](run-manifest.schema.json).

## Common metadata

```json
{
  "schema": "seatlayer.large-venue-performance.v1",
  "recordedAt": "ISO-8601 timestamp",
  "environment": "local-production-build | deployed-production",
  "applicationCommit": "public commit or release identifier",
  "sdkVersion": "published package version",
  "fixture": {
    "name": "synthetic fixture name",
    "version": "fixture version",
    "sha256": "content hash",
    "seats": 0,
    "sections": 0
  },
  "client": {
    "browser": "name and exact version",
    "os": "name and version",
    "hardware": "model, CPU and memory where available",
    "viewport": { "width": 0, "height": 0, "devicePixelRatio": 1 },
    "foreground": true
  },
  "network": {
    "cacheState": "cold | warm | uncontrolled",
    "throttling": "none or named profile",
    "connection": "documented test connection"
  }
}
```

Fields that cannot be observed must be recorded as `"unknown"`; they must not
be silently omitted when that uncertainty affects interpretation. Public files
must not include credentials, buyer data, private event identifiers, internal
hostnames, or provider-specific infrastructure details.

## Renderer record

A renderer record adds:

```json
{
  "kind": "renderer",
  "milestonesMs": {
    "pickerReady": 0,
    "allSeatsMaterialized": 0
  },
  "scene": {
    "initialSeatNodes": 0,
    "peakSeatNodes": 0,
    "finalSeatNodes": 0,
    "heapMb": null
  },
  "interactions": {
    "focusSection": { "samples": 0, "p50FrameMs": 0, "p95FrameMs": 0, "maxFrameMs": 0 },
    "pan": { "samples": 0, "p50FrameMs": 0, "p95FrameMs": 0, "maxFrameMs": 0 },
    "zoom": { "samples": 0, "p50FrameMs": 0, "p95FrameMs": 0, "maxFrameMs": 0 },
    "selectionBurst": { "samples": 0, "p50FrameMs": 0, "p95FrameMs": 0, "maxFrameMs": 0 },
    "statusDeltaBurst": { "samples": 0, "p50FrameMs": 0, "p95FrameMs": 0, "maxFrameMs": 0 }
  }
}
```

`pickerReady` begins at the documented renderer start point. It must state
whether chart and application downloads occur before that timer.
`allSeatsMaterialized` may be absent for a viewport-rendered overview and must
then be `null` with an explanation. Frame sampling begins before the synchronous
interaction action so the first blocked frame is included.

## Simultaneous-viewer record

A viewer-load record adds:

```json
{
  "kind": "simultaneous-viewers",
  "targetViewers": 0,
  "plateauSeconds": 0,
  "generator": {
    "locations": [],
    "instances": 0,
    "connectionRatePerSecond": 0
  },
  "stressedEvent": {
    "open": 0,
    "initialized": 0,
    "responsive": 0,
    "errors": 0,
    "reconnects": 0,
    "responseLatencyMs": { "p50": 0, "p95": 0, "max": 0 }
  },
  "quietControlEvent": {
    "baseline": {},
    "duringPlateau": {}
  },
  "admissionLimits": {
    "documented": true,
    "rateLimitedResponses": 0
  }
}
```

The plateau result is the minimum of open, initialized, and responsive sessions
observed concurrently. Report admission-limit responses separately from server
errors. The control event uses the same observation method before and during
the stressed-event plateau.

## Review gate

Before a result is called published evidence:

- validate the JSON against the checked-in schema;
- run the documented repetitions on every claimed environment and viewport;
- preserve outliers, failures, aborted runs, and generator saturation evidence;
- confirm that the summary can be reproduced from the raw records;
- state limitations beside the headline result;
- link the exact live demo or public fixture version used in the run.
