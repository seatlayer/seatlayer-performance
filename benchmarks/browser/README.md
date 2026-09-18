# Browser performance measurement

The [stadium scale benchmark](../../results/2026-09-15/stadium-scale-benchmark.md) measures SeatLayer's complete buyer picker using original, versioned chart fixtures and local seeded availability.

## Chart readiness

The fixture is fetched, SHA-256 verified and parsed before picker rendering begins. Those steps are recorded separately. The picker emits `chart_rendered` when its section overview is usable. In viewport mode, individual seat graphics materialize as the buyer explores.

The measured renderer build and browser environment are recorded with every result. Source-build results identify the renderer revision; published-SDK results identify the package version.

## Interaction sequence

Every run starts from a fresh page load and records these seven actions:

1. Enter section 101 and allow 1,200 ms to settle.
2. Zoom in six times and out six times, 120 ms between steps, followed by 400 ms settling.
3. Pan at seat detail: 12 steps out and 12 back across 220 × 140 CSS pixels, with 16 ms between steps and 200 ms settling.
4. Enter section 121 and settle for 1,200 ms.
5. Return to section 101 and settle for 1,200 ms.
6. Select and deselect 32 seats sequentially, 25 ms between changes, then settle for 200 ms.
7. Apply a local held/booked status batch and settle for 400 ms.

A frame sampler starts before each action, includes the first synchronous delay and continues through the settling period. Two additional animation frames complete each sample. The raw records contain every interval. The tab remains visible throughout; background samples are flagged.

## Calculations

- Mean FPS per action: `1000 / mean(frame intervals in milliseconds)`.
- Readiness summary: minimum, median and maximum across complete runs.
- Interaction summary: minimum and median of the individual runs' mean FPS.
- Frame percentiles: nearest rank within each run.
- Slow-frame count: intervals greater than 33.4 ms.

Every measured repetition is retained, including slower runs. The benchmark measures browser rendering; status propagation across a network and simultaneous-viewer traffic use separate workloads.

## Fixtures and records

[Download the venues](../../venues/) · [Inspect raw runs](../../results/2026-09-15/runs/) · [Read the measured results](../../results/2026-09-15/stadium-scale-benchmark.md)
