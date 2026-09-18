# Performance results

| Benchmark | Charts | Measurements |
| --- | --- | --- |
| [18 September 2026](2026-09-18/concurrency-10k.md) | 12K-seat event | 10,000 simulated concurrent buyers over a 120 s plateau; 10,000 sockets with ten writers; a 15,000-buyer attempt that did not pass on the host |
| [18 September 2026](2026-09-18/concurrency-benchmark.md) | 12K-seat event plus a small API fixture | 5,000 simulated users; 2,000 sockets with ten writers; 500-client API read burst. Its 10,000-user attempt is superseded by the run above |
| [15 September 2026](2026-09-15/stadium-scale-benchmark.md) | 100K, 150K and 200K stadiums | Three runs per chart, readiness, seven interaction probes, [all nine raw records](2026-09-15/runs/) |
| [14 September 2026](2026-09-14/century-100k-browser-benchmark.md) | 100K stadium and arena | Five runs per chart, readiness and interaction frames. Arena figures belong to fixture 1.0.0; a re-run on arena 2.0.0 is pending |

## Reading a result

**Chart readiness** records when the section overview becomes usable. Each benchmark describes where its timer starts. In viewport mode, seat graphics materialize as buyers explore sections.

**Interaction FPS** is calculated from animation-frame intervals during an action and its settling period. Minimum and median values summarize the mean FPS of individual runs. Raw intervals show the longer frames as well as smooth periods.

**Environment and fixture identity** accompany each benchmark: browser, viewport, device-pixel ratio, build revision and chart SHA-256. Dated results retain their original conditions.

The September 15 `seatlayer.scale-browser-run.v1` records contain readiness, environment, probe configuration, per-action frame statistics and the complete `rawFrameMs` arrays. The [browser method](../benchmarks/browser/README.md) describes their action sequence and calculations.

The earlier [browser interaction schema](browser-interaction-run.schema.json) describes the manual 30-second sample format. The [run manifest schema](run-manifest.schema.json) describes the broader workload record format.
