# Performance results

| Benchmark | Charts | Measurements |
| --- | --- | --- |
| [15 September 2026](2026-09-15/stadium-scale-benchmark.md) | 100K, 150K and 200K stadiums | Three runs per chart, readiness, seven interaction probes, [all nine raw records](2026-09-15/runs/) |
| [14 September 2026](2026-09-14/century-100k-browser-benchmark.md) | 100K stadium and arena | Five runs per chart, readiness and interaction frames |

## Reading a result

**Chart readiness** records when the section overview becomes usable. Each benchmark describes where its timer starts. In viewport mode, seat graphics materialize as buyers explore sections.

**Interaction FPS** is calculated from animation-frame intervals during an action and its settling period. Minimum and median values summarize the mean FPS of individual runs. Raw intervals show the longer frames as well as smooth periods.

**Environment and fixture identity** accompany each benchmark: browser, viewport, device-pixel ratio, build revision and chart SHA-256. Dated results retain their original conditions.

The September 15 `seatlayer.scale-browser-run.v1` records contain readiness, environment, probe configuration, per-action frame statistics and the complete `rawFrameMs` arrays. The [browser method](../benchmarks/browser/README.md) describes their action sequence and calculations.

The earlier [browser interaction schema](browser-interaction-run.schema.json) describes the manual 30-second sample format. The [run manifest schema](run-manifest.schema.json) describes the broader workload record format.
