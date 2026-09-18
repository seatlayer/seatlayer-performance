# Concurrency benchmark, 18 September 2026

- **10,000 simulated concurrent buyers** on one 12,000-seat event: engine-side hold latency p99 9 ms, zero server errors.
- **10,000 connected viewers, ten writers:** 400,000 of 400,000 live seat updates delivered, p95 383 ms.
- **3,552 requests per second** sustained for two minutes on one event.

Measured in an isolated engine harness on a single workstation. These are distinct workloads. A simulated concurrent buyer is an active session with think time, not one in-flight request or a simultaneous booking.

## Mixed buyer workload

Every virtual user polls availability; 30% also perform a seat inventory read; 5% attempt a one- or two-seat hold followed by a release after 1 to 3 seconds. Think time is 1.5 to 2.5 seconds.

| Simulated buyers | Requests/second | Availability engine p99 | Hold engine p99 | Availability HTTP p99 | Hold HTTP p99 | Server errors |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 500 | 328 | 6 ms | 8 ms | 8.7 ms | 8.3 ms | 0 |
| 2,000 | 1,327 | 2 ms | 3 ms | 63.5 ms | 13.1 ms | 0 |
| 5,000 | 3,315 | 2 ms | 4 ms | 69.1 ms | 52.2 ms | 0 |
| 10,000 | 3,552.7 | 4 ms | 9 ms | 2,265.7 ms | 2,312.0 ms | 0 |

The 500, 2,000 and 5,000 rows are plateau stages of one staged run with 5-second ramps, 20-second plateaus and a 5-second ramp down; 128,150 HTTP requests completed with no HTTP failures, 4,362 successful holds and 130 refused holds. **The 10,000 row ran as its own test: a 120-second ramp to 10,000 virtual users, then a 120-second plateau**, with virtual users pinned at exactly 10,000 for every sample of the plateau window. Its plateau carried 390,795 requests, 12,977 accepted holds, 1,098 refused holds and 32 transport failures (0.0082%), all of them TCP connection resets on the loopback interface, on the release route, with no HTTP response and therefore no server error.

Engine-side latency is the time the event engine took to process the request, measured at the engine boundary, excluding network. It stays in single-digit milliseconds at every stage. The HTTP p99 of roughly 2.3 seconds in the 10,000 row belongs to the harness: k6 and the event engine shared the same 11 CPUs, so that figure carries load-generator contention.

Refused holds are not graded as system failures. Seat labels are drawn at random across 12,000 seats, so two buyers can pick the same seat, and the harness retains no refusal reason.

## Live inventory updates

Each stage issues 40 distinct-seat holds in four bursts of ten concurrent writers, with a ten-second delivery observation deadline. Every requested socket connected and every expected delta arrived.

| Connected viewers | Concurrent writers | Hold HTTP p95 | Update p95 | Update p99 | Received / expected updates |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 10 | 10.2 ms | 26.9 ms | 27.4 ms | 4,000 / 4,000 |
| 500 | 10 | 6.4 ms | 34.1 ms | 34.6 ms | 20,000 / 20,000 |
| 1,000 | 10 | 20.6 ms | 51.1 ms | 51.9 ms | 40,000 / 40,000 |
| 2,000 | 10 | 14.4 ms | 59.4 ms | 60.9 ms | 80,000 / 80,000 |
| 5,000 | 10 | 75.8 ms | 220.4 ms | 225.6 ms | 200,000 / 200,000 |
| 10,000 | 10 | 169.6 ms | 382.9 ms | 394.0 ms | 400,000 / 400,000 |

Zero missing deliveries, zero hold failures and zero unexpected disconnects at any stage. Updates were measured from HTTP issue to socket receipt, and update latency grows with recipient count. Releases were performed afterwards; release-update latency was not graded. The run used public v1 protocol sockets, not a mixture of private access scopes.

## Public API read bursts

| Configured clients | Requests | Read p50 | Read p95 | Read p99 | HTTP failures |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 20 | 40 | 303 ms | 997 ms | 1,058 ms | 0 |
| 100 | 200 | 238 ms | 1,087 ms | 1,169 ms | 0 |
| 500 | 1,000 | 434 ms | 1,190 ms | 1,332 ms | 0 |

Each client made one availability request followed by one seat inventory read. The bursts began 15 seconds apart. All 1,240 responses were HTTP 200. This is a short read burst, not sustained polling or a checkout test. The once-per-second virtual user gauge peaked at 399 during the configured 500-client scenario; configured clients do not imply that every handler executed simultaneously.

## Methodology and scope

- Date: 18 September 2026. Event engine revisions: `93a1cd1f6e656ce3eb5dec16ec7c91fff758dfe2` for the 500 to 5,000 stages, the socket run and the API bursts; `8d4f28dc10aa92fd75c9904a92811205fafe5d34` for the 10,000-buyer run and the extended fan-out.
- Mixed workload and socket tests ran in a local isolated event-engine harness on Node 24.16.0, k6 v2.2.0, macOS on arm64 with 11 CPUs and 18 GB RAM. The same workstation generated the load. Synthetic inventory: 12,000 seats, one event.
- The harness runs real event-engine code with trusted access, no authentication, no rate limiting, no main-database or queue bindings and no tenant metadata. Seat inventory read responses return a byte count rather than the full inventory.
- The public API read test used the deployed development service and an existing small fixture whose seat inventory read response was 138 bytes. It exercised public routes and database access. It did not reproduce a 12,000-seat payload or validate writes.
- Engine-side latency is elapsed time, not CPU time. HTTP timing excludes initial connection setup. Plateau percentiles use nearest rank over the steady window; k6 run summaries cover whole runs including ramps, so their percentiles differ. Combined API percentiles use k6 interpolation.

## What this does and does not show

It shows that one ordering authority per event served 10,000 simulated concurrent buyers on a 12,000-seat event for a full two-minute plateau with engine-side latency in single-digit milliseconds and no server errors, and that it delivered every expected live seat update to 10,000 connected viewers.

It does not show:

- payment, order creation, confirmed bookings or best-available selection, which were not exercised;
- a production capacity ceiling or a maximum supported audience, since local throughput does not override the platform limits of the production environment;
- service latency at the HTTP layer, because those percentiles carry load-generator contention from the shared workstation;
- concurrency at 200,000 seats, since the fixture is one synthetic 12,000-seat event.

## Supported claim

"SeatLayer's single-event engine sustained 10,000 simulated concurrent buyers on a 12,000 seat fixture in an isolated harness, with engine-side hold latency p99 of 9 ms and zero HTTP 5xx at the plateau, and separately delivered all 400,000 expected hold updates to 10,000 connected viewers."

Link this method with the claim. The renderer and concurrency benchmarks measure separate scenarios.

## Runs

| File | Contents |
| --- | --- |
| [`runs/stages.json`](runs/stages.json) | Plateau measurements for the 10,000-buyer run |
| [`runs/summary-10k.json`](runs/summary-10k.json) | Complete k6 summary for the 10,000-buyer run |
| [`runs/error-codes.json`](runs/error-codes.json) | Transport error-code counts for the 10,000-buyer run |
| [`runs/fanout-extended.json`](runs/fanout-extended.json) | Delivery and latency measurements for all six viewer stages |
| [`mixed-workload-stages.json`](mixed-workload-stages.json) | Stage measurements for the 500 to 5,000 buyer stages |
| [`mixed-workload-summary.json`](mixed-workload-summary.json) | Complete k6 summary for the 500 to 5,000 buyer run |
| [`fanout.json`](fanout.json) | Earlier socket delivery measurements, 100 to 2,000 viewers |
| [`api-read-summary.json`](api-read-summary.json) | Public API read burst summary |
| [`api-read-routes.json`](api-read-routes.json) | Public API read burst, route-level measurements |

The load scripts are published in [`benchmarks/concurrency/`](../../benchmarks/concurrency/): `drill-10k-slow.k6.js`, `fanout-extended.mjs` and `plateau-stats.mjs`. They run against the isolated event-engine harness described above. That harness and the engine source are not distributed in this repository, so the scripts are an exact description of the workload rather than a standalone reproduction kit. The raw k6 streams were 3 GB and larger and are not retained here; the retained files are result summaries.
