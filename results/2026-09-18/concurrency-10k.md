# 10,000 concurrent buyers and 10,000 connected viewers, 18 September 2026

**10,000 simulated concurrent buyers** were sustained on one 12,000-seat event for a 120-second plateau, with **hold RPC p99 of 9 ms** and **zero HTTP 5xx**. A separate fan-out run delivered **400,000 of 400,000** expected hold updates to **10,000 connected viewers** with ten concurrent writers.

This is a follow-up to the [18 September concurrency benchmark](concurrency-benchmark.md) and supersedes the interrupted 10,000-user attempt described there. Same event engine, same 12,000-seat fixture, same request mix; the ramp was slowed from 20 seconds to 120 seconds and nothing else was changed.

## What was run

Three mixed buyer workload runs and one extended socket fan-out run against a local isolated harness on one workstation. No engine source was changed, nothing was deployed, and no production or development service was contacted.

- Event engine revision under test: `8d4f28dc10aa92fd75c9904a92811205fafe5d34`.
- Host: macOS on arm64, 11 CPUs, 18 GB RAM, Node 24.16.0, k6 v2.2.0. The event engine ran locally on the same workstation that generated the load.
- Fixture: one synthetic event with 12,000 seats.
- Each virtual user polls availability every iteration; 30% also read compact objects; 5% attempt a one- or two-seat hold and release it after 1 to 3 seconds; think time is 1.5 to 2.5 seconds. Connections are reused per virtual user. A virtual user is an active session with think time, not one in-flight request.

| Run | Script | Stages | Outcome |
| --- | --- | --- | --- |
| 10,000 buyers | `drill-10k-slow.k6.js` | 0 to 10,000 over 120 s, 120 s plateau, 20 s ramp down | Pass |
| 15,000 attempt 1 | `drill-15k.k6.js` | 0 to 15,000 over 180 s, 120 s plateau, 30 s ramp down | Not passed |
| 15,000 attempt 2 | `drill-15k.k6.js` with a 300 s ramp | 0 to 15,000 over 300 s, 120 s plateau, 30 s ramp down | Not passed |

Plateau figures come from the raw k6 JSON stream over the steady window only (the middle 110 seconds of each plateau), nearest rank. The k6 run summaries cover whole runs including ramps, so their percentiles differ.

## Mixed buyer workload at 10,000 users

Virtual users were pinned at exactly 10,000 for every sample of the plateau window.

| Plateau measure | Value |
| --- | ---: |
| HTTP requests in window | 390,795 |
| HTTP requests per second | 3,552.7 |
| Transport failures | 32 of 390,795 (0.0082%) |
| HTTP 5xx | 0 |
| Holds accepted | 12,977 |
| Holds refused | 1,098 |

| Route | RPC p50 | RPC p95 | RPC p99 | HTTP p99 |
| --- | ---: | ---: | ---: | ---: |
| availability | 0 ms | 2 ms | 4 ms | 2,265.7 ms |
| objects | 1 ms | 2 ms | 4 ms | 2,318.3 ms |
| hold | 1 ms | 4 ms | 9 ms | 2,312.0 ms |
| release | not instrumented | not instrumented | not instrumented | 2,193.7 ms |

Both success criteria were met: the plateau failure rate of 0.0082% is below the 0.1% bar, and no response carried a 5xx status.

**HTTP p99 of roughly 2.3 seconds is a harness artefact, not a service latency reading.** k6 and the event engine shared the same workstation and the same 11 CPUs, so the HTTP figures include load-generator contention. The RPC values are caller-side elapsed time across the boundary of the authoritative object for the event, and are the engine-side signal.

Refused holds are not graded as system failures. Seat labels are drawn at random across 12,000 seats, so two buyers can pick the same seat, and the harness retains no refusal reason.

[Plateau measurements](runs/stages.json) · [Complete k6 summary](runs/summary-10k.json)

## Error breakdown

All 32 plateau failures were k6 error code 1220, a TCP connection reset by peer on the loopback interface, and all of them landed on the release route. None of them received an HTTP response, so none were server errors.

| Error code | Meaning | 10,000-buyer run, whole run |
| ---: | --- | ---: |
| 1220 | TCP connection reset by peer | 32 |
| 1201 | TCP broken pipe | 0 |
| 1200 | Generic TCP error | 0 |
| 1000 | Generic request error | 0 |

The earlier 10,000-user attempt with a 20-second ramp failed 21.56% of its requests with the same error code. Slowing the ramp to 120 seconds, and changing nothing else, removed almost all of them, which points at the connection establishment rate on the host rather than at the engine.

[Full error-code counts for all three runs](runs/error-codes.json)

## Live inventory updates at 10,000 viewers

Each stage issues 40 distinct-seat holds in four bursts of ten concurrent writers, with a ten-second delivery observation deadline. Every requested socket connected and every expected delta arrived.

| Connected viewers | Concurrent writers | Hold HTTP p95 | Update p95 | Update p99 | Received / expected updates |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 10 | 10.2 ms | 26.9 ms | 27.4 ms | 4,000 / 4,000 |
| 500 | 10 | 6.4 ms | 34.1 ms | 34.6 ms | 20,000 / 20,000 |
| 1,000 | 10 | 20.6 ms | 51.1 ms | 51.9 ms | 40,000 / 40,000 |
| 2,000 | 10 | 14.4 ms | 59.4 ms | 60.9 ms | 80,000 / 80,000 |
| 5,000 | 10 | 75.8 ms | 220.4 ms | 225.6 ms | 200,000 / 200,000 |
| 10,000 | 10 | 169.6 ms | 382.9 ms | 394.0 ms | 400,000 / 400,000 |

No missing deliveries, no hold failures and no unexpected disconnects at any stage. Update latency grows with recipient count, as the table shows.

The earlier 3,000-socket ceiling reported in previous work was a file-descriptor limit in the launching shell, not a runtime limit: with the descriptor limit raised, the harness opened 10,000 sockets without error. A first attempt at this run crashed at the 5,000-viewer stage on a load-script defect, which was fixed before every stage was rerun from a fresh runtime.

[Delivery and latency measurements](runs/fanout-extended.json)

## The 15,000-buyer attempt

Both attempts reached 15,000 virtual users and both failed on loopback connection resets.

| Plateau measure | Attempt 1 (180 s ramp) | Attempt 2 (300 s ramp) |
| --- | ---: | ---: |
| HTTP requests in window | 699,819 | 642,594 |
| HTTP requests per second | 6,362.0 | 5,842.7 |
| Transport failure rate | 87.21% | 88.54% |
| HTTP 5xx | 0 | 0 |
| Holds accepted / refused | 2,923 / 22,708 | 2,478 / 21,078 |

**This is a host and load-generator limit, not an engine result.** The failures are connection resets and broken pipes on the loopback interface with no HTTP response at all, never a server error. The host listen backlog was 128 for every run and was never raised, and doubling the ramp from 180 to 300 seconds did not change the picture, which is what a 128-entry backlog predicts. The high plateau request rate is an artefact: a reset returns immediately, so failed iterations churn faster than successful ones.

The roughly 8% of requests that completed are not a clean engine reading either, with k6 itself saturating the same 11 CPUs. The honest statement is that **15,000 users was not measured on this host**. Repeating it requires a larger host listen backlog before rerunning the same script.

[Complete k6 summary](runs/summary-15k.json) · [Plateau measurements](runs/stages.json)

## Methodology and scope

- Date: 18 September 2026. Event engine revision `8d4f28dc10aa92fd75c9904a92811205fafe5d34`.
- The harness runs real event-engine code with trusted access, no authentication, no rate limiting, no main-database or queue bindings and no tenant metadata. The compact-objects response returns a byte count rather than the full inventory.
- These runs exclude best-available selection, payment, order creation and confirmed bookings.
- RPC time is caller-side elapsed time across the boundary of the authoritative object for the event, not CPU time. HTTP timing excludes initial connection setup.
- Percentiles over the plateau window use nearest rank. The k6 run summaries cover whole runs, so their percentiles differ from the plateau tables.
- k6 and the event engine ran on the same workstation, so HTTP percentiles include load-generator contention and are not a service latency guarantee.
- Local throughput does not override the platform limits of the production environment. Nothing here establishes a production capacity ceiling, a maximum supported audience, or performance at 200,000 seats under the same concurrent workload.

## Reproduction

The load scripts are published in [`benchmarks/concurrency/`](../../benchmarks/concurrency/). They run against the isolated event-engine harness described above. **That harness and the engine source are not distributed in this repository**, so these scripts are a description of the exact workload rather than a standalone reproduction kit. `plateau-stats.mjs` turns a raw k6 JSON stream into the plateau tables above. The raw streams were 3 GB and larger and are deliberately not retained here; the retained files are result summaries.

## Supported claim

"SeatLayer's single-event engine sustained 10,000 simulated concurrent buyers on a 12,000 seat fixture in an isolated harness, with hold RPC p99 of 9 ms and zero HTTP 5xx at the plateau, and separately delivered all 400,000 expected hold updates to 10,000 connected viewers."

Link this method with the claim. A 15,000-buyer run did not pass on this host and remains unmeasured. These are separate engine workloads, not a measured production checkout ceiling.
