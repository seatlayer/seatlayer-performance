# Stadium scale benchmark, 15 September 2026

SeatLayer's buyer picker rendered **100,000, 150,000 and 200,000 reserved seats**, each across 200 sections. Three complete runs were recorded for each stadium, covering section entry, zoom, pan, seat selection and status updates.

| Seats | Chart ready | Zoom in/out | Pan |
| ---: | ---: | ---: | ---: |
| 100,000 | 1.02 s | 58.6 FPS | 60.0 FPS |
| 150,000 | 1.44 s | 58.6 FPS | 60.0 FPS |
| 200,000 | 1.95 s | 57.6 FPS | 60.0 FPS |

The table shows median chart readiness and the median of per-run mean FPS. All nine runs are included in [the raw measurements](runs/).

## Chart readiness

| Seats | Minimum | Median | Maximum |
| ---: | ---: | ---: | ---: |
| 100,000 | 996.8 ms | 1,018.8 ms | 1,066.6 ms |
| 150,000 | 1,400.0 ms | 1,443.9 ms | 1,533.4 ms |
| 200,000 | 1,929.8 ms | 1,953.6 ms | 2,638.0 ms |

Readiness starts inside picker rendering and ends when the section overview is usable. The preceding fixture download, hash verification and JSON parsing are recorded separately as `fixtureLoadMs`. Individual seat graphics materialize as buyers enter sections.

## Interaction performance

Each cell is the minimum / median of per-run mean FPS across the three runs. The raw records also include every frame interval, p50 and p95 frame times, maximum frame time, and frames exceeding 33.4 ms.

| Interaction | 100K seats | 150K seats | 200K seats |
| --- | ---: | ---: | ---: |
| First section entry | 53.73 / 55.19 | 52.10 / 52.89 | 45.35 / 51.99 |
| Zoom in/out at seat detail | 58.54 / 58.55 | 57.63 / 58.59 | 52.85 / 57.65 |
| Pan at seat detail | 60.01 / 60.01 | 58.76 / 60.00 | 52.26 / 60.00 |
| Second section entry | 58.38 / 59.19 | 56.75 / 56.76 | 48.63 / 55.13 |
| Return to first section | 59.19 / 59.20 | 58.38 / 59.19 | 51.91 / 53.60 |
| 32 select/deselect pairs | 59.01 / 59.98 | 59.99 / 59.99 | 59.99 / 59.99 |
| Seat-status batch | 60.03 / 60.03 | 57.83 / 57.85 | 55.87 / 57.85 |

## Measurement setup

- Date: 15 September 2026.
- Browser: Chrome 152 on macOS; viewport 1280 × 720 CSS pixels, device pixel ratio 2, hardware concurrency reported as 11.
- Build: local optimized production browser bundle, renderer revision `3b5fc9fab7362437ee495d9826e281c96f392a65`.
- Inventory: original synthetic fixtures with local seeded availability; [manifest](../../venues/v1/manifest.json).
- Rendering: section overview first, with seat graphics materialized for the viewport.
- Sampling: one visible browser session, three complete runs per fixture; every recorded interaction remained in the foreground. FPS is calculated from `requestAnimationFrame` intervals during the scripted interaction and its settling period.
- Status batch: 159 seats for 100K, 218 for 150K, and 256 for 200K. This measures rendering after the batch is applied.

This is a browser rendering benchmark. Network propagation and simultaneous-viewer capacity are separate measurements.

## Read the records

Each [JSON run](runs/) identifies the fixture hash, renderer build, environment, readiness timing, interaction settings and raw frame intervals. Median readiness is the middle of three observations. Interaction medians use each run's mean FPS; they are not pooled frame averages. The benchmark build is identified by its source revision rather than an SDK package version.
