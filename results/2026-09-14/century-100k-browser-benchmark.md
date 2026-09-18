# Century 100K browser benchmark, 14 September 2026

SeatLayer rendered two original synthetic large-venue fixtures: Century Stadium
and Century Arena, each with exactly 100,000 reserved seats across 200 sections.
Five production-build runs were measured for each venue. The
stadium fixture SHA-256 is
`4ce4333febdec467bfa5b3014867f6fdd91462f2f146c4abc6f9c637f492f871`;
the arena fixture SHA-256 is
`29fb737d8adb1ae4195495cfba1b563506052abe4f1d9eb750b366f968d97c7d`.
Those are the exact bytes measured, and both remain published under
[venues/v1](../../venues/v1/manifest.json).

Century Arena 2.0.0
(`c6c881670445b1bf78e6f52ed1bd8a3fd395e3e1b2aba8a93da808a29a7b7445`) was
published on 16 September 2026 as a caption-only revision with identical seat,
section, row and zone counts. The arena figures below belong to 1.0.0 and are
not restated for it: the arena benchmark is **pending a re-run on fixture
2.0.0**.

Five measured runs per fixture were retained. The test used a local production
bundle, local seeded inventory, Chrome 152, a 1280 × 800 CSS-pixel viewport at
DPR 1, and one visible desktop browser session. The host was a Mac15,6 with
Apple M3 Pro and 18 GiB RAM on macOS 26.6.2.

## Readiness

Picker readiness begins inside picker rendering. Fixture fetch, SHA-256
verification and JSON parsing happen before the timer and are excluded. In
viewport mode, readiness marks when the section overview is usable; individual
seat graphics materialize as the buyer enters a section.

| Fixture | Runs | Readiness min / median / max |
| --- | ---: | ---: |
| Century Stadium | 5 | 1,153.3 / 1,222.5 / 1,304.5 ms |
| Century Arena | 5 | 1,158.5 / 1,184.7 / 1,201.9 ms |

Readiness uses min, median and max. A p95 is not reported for five readiness
observations.

## Interaction frames

Frame intervals are pooled from every raw `requestAnimationFrame` sample across
the five runs for that fixture and interaction. Percentiles use nearest rank.
Mean FPS is calculated per run and summarized with its minimum and median.

| Fixture and interaction | Per-run mean FPS min / median | Pooled RAF median / p95 / p99 / max | Frames over 33.4 ms |
| --- | ---: | ---: | ---: |
| Stadium · focus first section | 54.39 / 55.26 | 16.7 / 33.3 / 34.1 / 34.5 ms | 13 / 347 |
| Stadium · zoom in/out at seat detail | 58.07 / 59.04 | 16.7 / 18.6 / 33.4 / 50.1 ms | 4 / 609 |
| Stadium · programmatic pan | 60.00 / 60.00 | 16.7 / 18.5 / 18.6 / 18.7 ms | 0 / 232 |
| Stadium · warm section revisit | 60.00 / 60.01 | 16.7 / 18.5 / 18.6 / 18.8 ms | 0 / 370 |
| Stadium · 32 select/deselect pairs | 58.52 / 60.02 | 16.7 / 18.5 / 18.7 / 66.7 ms | 1 / 583 |
| Stadium · 159-seat local status burst | 60.01 / 60.03 | 16.7 / 18.4 / 18.7 / 18.7 ms | 0 / 135 |
| Arena · focus first section | 54.56 / 55.31 | 16.7 / 33.3 / 33.4 / 34.4 ms | 8 / 349 |
| Arena · zoom in/out at seat detail | 58.07 / 58.13 | 16.7 / 18.1 / 33.4 / 50.1 ms | 6 / 610 |
| Arena · programmatic pan | 59.99 / 60.04 | 16.7 / 17.2 / 18.1 / 18.6 ms | 0 / 230 |
| Arena · warm section revisit | 58.38 / 60.00 | 16.7 / 18.1 / 18.6 / 50.0 ms | 1 / 367 |
| Arena · 32 select/deselect pairs | 59.98 / 59.99 | 16.7 / 18.1 / 18.5 / 18.7 ms | 0 / 584 |
| Arena · 187-seat local status burst | 57.99 / 60.03 | 16.7 / 18.1 / 18.6 / 33.2 ms | 0 / 135 |

The local status burst measures browser rendering after a synthetic status
batch is applied. Subscription and network propagation are measured separately.

## Test scope

This browser benchmark measures renderer readiness and interaction frames after
the local fixture has loaded. API and simultaneous-viewer capacity are measured
as separate production workloads.
