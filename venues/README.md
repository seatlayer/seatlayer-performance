# Synthetic venue fixtures

Original stadium and arena layouts for repeatable SeatLayer performance testing.

| Venue | Seats | Sections | Download |
| --- | ---: | ---: | --- |
| Century Stadium | 100,000 | 200 | [Chart JSON](v1/century-stadium.json) |
| Century Arena | 100,000 | 200 | [Chart JSON](v1.1/century-arena.json) |
| Century Stadium 150 | 150,000 | 200 | [Chart JSON](v1/century-stadium-150k.json) |
| Century Stadium 200 | 200,000 | 200 | [Chart JSON](v1/century-stadium-200k.json) |

The [v1 manifest](v1/manifest.json) and the [v1.1 manifest](v1.1/manifest.json) record exact file sizes, inventory counts and SHA-256 hashes. Charts use compact authored rows and preserve stable seat identities through JSON export/import.

## Fixture versions

Century Arena 2.0.0 lives in [v1.1](v1.1/century-arena.json). It changes captions only: the event-floor caption now sits on a floor panel west of the centre stage instead of on top of it, and the centre-stage caption ink was darkened for readable contrast. Seats (100,000), sections (200), rows (4,800) and zones (8) are unchanged.

Century Arena 1.0.0 stays published at [v1/century-arena.json](v1/century-arena.json) with its original SHA-256, because it is the chart the 14 September 2026 arena benchmark measured. Each manifest records the other version, so either hash resolves to the file that produced it.

These are original synthetic layouts, with no customer or real-venue source data. They are performance fixtures rather than venue construction or safety plans.
