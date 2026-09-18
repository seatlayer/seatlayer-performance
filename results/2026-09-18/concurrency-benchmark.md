# Concurrency benchmark — 18 September 2026

**Tested with 5,000 simulated concurrent users on one 12,000-seat event.** Separate live-update tests delivered all 80,000 expected hold updates to 2,000 connected viewers with ten concurrent writers.

These are distinct workloads. The 5,000-user result includes think time; it does not mean 5,000 simultaneous bookings. A 10,000-user result has not been measured, and averaging these results cannot establish it.

## Mixed buyer workload

| Simulated concurrent users | HTTP requests/second | Availability RPC p99 | Hold RPC p99 | Availability HTTP p99 | Hold HTTP p99 |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 500 | 328 | 6 ms | 8 ms | 8.7 ms | 8.3 ms |
| 2,000 | 1,327 | 2 ms | 3 ms | 63.5 ms | 13.1 ms |
| 5,000 | 3,315 | 2 ms | 4 ms | 69.1 ms | 52.2 ms |

Across the run, 128,150 HTTP requests completed with no HTTP failures. There were 4,362 successful holds and 130 refused holds. The harness did not retain refusal reasons, so these are not presented as zero application failures. Random seat selection permits contention.

Every virtual user polled availability; 30% also read compact objects, and 5% attempted a one- or two-seat hold followed by release after 1–3 seconds. Think time was 1.5–2.5 seconds. The run used 5-second ramps, 20-second plateaus, and a 5-second ramp down. Rates describe the approximate plateau windows, not a sustained service guarantee.

[Stage measurements](mixed-workload-stages.json) · [Complete k6 summary](mixed-workload-summary.json)

## Live inventory updates

| Connected viewers | Concurrent writers | Hold HTTP p95 | Update p95 | Update p99 | Received / expected updates |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 10 | 10.5 ms | 28.4 ms | 28.8 ms | 4,000 / 4,000 |
| 500 | 10 | 7.3 ms | 33.8 ms | 34.2 ms | 20,000 / 20,000 |
| 1,000 | 10 | 24.6 ms | 74.0 ms | 75.4 ms | 40,000 / 40,000 |
| 2,000 | 10 | 32.2 ms | 102.8 ms | 104.4 ms | 80,000 / 80,000 |

Each stage issued 40 distinct-seat holds in four bursts of ten writers. Every expected hold delta arrived within the ten-second observation deadline. No hold failures or unexpected disconnects were recorded. Updates were measured from HTTP issue to socket receipt. Releases were performed afterward; release-update latency was not graded. This run used public v1 protocol sockets, not a mixture of private access scopes.

[Delivery and latency measurements](fanout.json)

## Public API read bursts

| Configured clients | Requests | Read p50 | Read p95 | Read p99 | HTTP failures |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 20 | 40 | 303 ms | 997 ms | 1,058 ms | 0 |
| 100 | 200 | 238 ms | 1,087 ms | 1,169 ms | 0 |
| 500 | 1,000 | 434 ms | 1,190 ms | 1,332 ms | 0 |

Each client made one availability request followed by one compact-object request. The bursts began 15 seconds apart. All 1,240 responses were HTTP 200. This is a short read burst, not sustained polling or a checkout test. The once-per-second VU gauge peaked at 399 during the configured 500-client scenario; configured clients do not imply that every handler executed simultaneously.

[API summary](api-read-summary.json) · [Route-level measurements](api-read-routes.json)

## Methodology and scope

- Date: 18 September 2026. Event engine source revision: `93a1cd1f6e656ce3eb5dec16ec7c91fff758dfe2`.
- Mixed workload and socket tests ran in local workerd through Miniflare 4.20260714.0, Node 24.16.0. The same workstation generated load. Synthetic inventory: 12,000 seats, one event. The mixed test had a V8 sampling profiler attached; the socket test did not.
- The isolated harness used real EventDO code but trusted access, no main-database or queue bindings, no public auth/rate limiting, and no tenant metadata. Compact-object HTTP responses returned a byte count rather than the full inventory. These tests exclude best-available selection, payment, order creation and confirmed bookings.
- The public API read test used the deployed development service and an existing small fixture whose compact-object response was 138 bytes. It exercised public routes and database access. It did not reproduce a 12,000-seat payload or validate writes. Local source/deployed version equivalence was not established.
- RPC time is caller-side elapsed time across the object boundary, not CPU time. HTTP timing excludes initial connection setup. Combined API percentiles use k6 interpolation; per-route exported percentiles use nearest rank.
- A separate burst probe passed 100 simultaneous distinct-seat holds, but its 500-request stage encountered a loopback connection reset. That incomplete result does not establish object saturation.
- Runtime, hardware, network, access scopes, mutation rate, inventory size, cold starts and deployment limits affect capacity. Local throughput does not override Cloudflare platform limits. The engine source and isolated harness are not distributed in this repository; the retained files are result summaries, not a standalone reproduction kit.

## Supported claim

“SeatLayer's single-event engine was benchmarked with 5,000 simulated concurrent users on a 12,000-seat fixture. A separate 2,000-viewer test delivered every expected hold update with ten concurrent writers.”

Link this method with the claim. These measurements do not establish a 5,000–10,000-user production capacity range, a maximum supported audience, or performance at 200,000 seats under the same concurrent workload. The renderer and concurrency benchmarks measure separate scenarios.
