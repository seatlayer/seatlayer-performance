# Concurrency measurement

These are the load scripts behind the [18 September 2026 concurrency benchmark](../../results/2026-09-18/concurrency-benchmark.md).

| Script | What it does |
| --- | --- |
| `drill-10k-slow.k6.js` | Mixed buyer workload, ramping to 10,000 virtual users over 120 s, then a 120 s plateau |
| `fanout-extended.mjs` | Opens 100 to 10,000 viewer sockets per stage and checks that every hold update reaches every connected viewer |
| `plateau-stats.mjs` | Reduces a raw k6 JSON stream to the plateau table and error-code counts published with the results |

## What they run against

They run against the isolated event-engine harness described in the results write-up: a local single-event runtime with trusted access, no authentication, no rate limiting, no main-database or queue bindings and no tenant metadata, seeded with one synthetic 12,000-seat event.

**That harness and the event engine source are not distributed in this repository.** These scripts are therefore an exact description of the workload that produced the published numbers, not a standalone reproduction kit. They document the request mix, think time, ramp shape, stage list and measurement points so the results can be read and challenged on their own terms.

## Workload

Each virtual user polls availability every iteration. 30% also perform a seat inventory read. 5% attempt a one- or two-seat hold, then release it after 1 to 3 seconds. Think time is 1.5 to 2.5 seconds, and connections are reused per virtual user. A virtual user is an active session with think time, not one in-flight request.

The fan-out script issues 40 distinct-seat holds per stage in four bursts of ten concurrent writers, then waits up to ten seconds for each update to reach every connected viewer before releasing the holds and moving to the next stage.

## Measurement points

- Engine-side latency is the time the event engine took to process the request, measured at the engine boundary, excluding network. The scripts read it from a response header and record it as the `rpc_ms_*` trends; the published results call these figures engine-side latency. It is elapsed time, not CPU time.
- The scripts and the retained k6 summaries are published exactly as they ran, so their internal metric identifiers are unchanged.
- HTTP timing excludes initial connection setup and includes load-generator contention when the load and the engine share a host, which was the case for the published runs.
- Plateau percentiles use nearest rank over the steady window only. The k6 run summary covers the whole run including the ramp, so its percentiles differ.

[Read the measured results](../../results/2026-09-18/concurrency-benchmark.md) · [Inspect the retained run files](../../results/2026-09-18/runs/)
