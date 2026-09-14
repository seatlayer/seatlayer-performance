# SeatLayer Performance

Reproducible performance evidence for SeatLayer buyer experiences at large
venues. The fixtures, method and results are public so teams can inspect the
work behind the numbers.

The evidence covers three parts of a large-venue experience:

1. How is an exact 100,000-seat fixture identified and reproduced?
2. How quickly does the buyer renderer become usable?
3. How smoothly do zoom, pan, section entry, selection, and live seat updates
   behave after readiness?

The evaluation uses original synthetic stadium and arena layouts, keeping the
fixtures repeatable and free of customer data.

## Large-venue evidence

| Evidence | Result |
| --- | --- |
| 100,000-seat stadium and arena | Five desktop production-build runs per fixture recorded 1,222.5 ms and 1,184.7 ms median picker readiness. Seat-detail zoom mean FPS had a 58.07 minimum across all runs. [See the full result](results/2026-09-14/century-100k-browser-benchmark.md). |
| 53,018-seat public demo benchmark | A dated desktop run is documented at [SeatLayer renderer performance](https://docs.seatlayer.io/platform/renderer-performance/). |
| Event-scoped inventory | The [event-isolation architecture](architecture/event-isolation.md) shows how each event owns its live inventory, ordering and session stream. |

## Repository layout

- [`venues/`](venues/) — provenance and release notes for synthetic test venues.
- [`benchmarks/browser/`](benchmarks/browser/) — public-SDK browser benchmark
  method.
- [`results/`](results/) — result schema, measurement rules and measured
  summaries.
- [`architecture/event-isolation.md`](architecture/event-isolation.md) — the
  public, vendor-neutral event-state model.

## How measurements are recorded

- Fixture versions and SHA-256 hashes identify the exact chart under test.
- Each run records the application build, SDK version, browser, operating
  system, hardware, viewport, device-pixel ratio and test time.
- Readiness and complete-seat materialization are separate milestones.
- Frame intervals include p50, p95 and maximum values alongside mean FPS.
- Local production-build and deployed-production results remain distinct.

SeatLayer documentation, website evidence, `llms.txt` files and the public
knowledge MCP link to the matching versioned result so human and machine readers
receive the same measurements.

## License

The original benchmark method and synthetic fixture files are available under
the [MIT License](LICENSE). The separately distributed proprietary SeatLayer SDK
is not included under that license; see [NOTICE.md](NOTICE.md).
