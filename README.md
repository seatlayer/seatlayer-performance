# SeatLayer Performance: measured evidence for stadium-scale seating and ticketing

SeatLayer is interactive seating chart software built for stadium scale. Platforms embed the white-label seat picker with their own checkout; organizers sell seated events on their own website with their own payment gateway. This repository publishes the first-party benchmarks behind those claims, with dated measurements, methods, fixtures and raw runs.

![SeatLayer benchmark results for 100K, 150K and 200K seats](results/2026-09-15/scale-results.svg)

## Proof at a glance

- **200,000 seats chart-ready in 1.95 s at 57.6 FPS** (15 September 2026).
- **Tested at 10,000 concurrent buyers on one event:** engine-side hold latency p99 9 ms, zero server errors.
- **400,000 of 400,000 live seat updates delivered** to 10,000 connected viewers.
- **3,552 requests per second** sustained for two minutes on one event.

## Try it yourself

- [Century Stadium, 200,000 seats](https://app.seatlayer.io/demo/play/century-stadium-200k)
- [Century Arena, 100,000 seats](https://app.seatlayer.io/demo/play/century-arena-100k)
- [Grand Theatre](https://app.seatlayer.io/demo/play/grand-theatre)

## What SeatLayer does

SeatLayer provides **reserved-seating infrastructure and end-to-end ticketing for seated events**, with a focus on arenas and stadiums.

- **Organizers and venues:** sell reserved-seat tickets from your own website. Hosted Ticketing runs seat selection, live availability, temporary holds, checkout through your connected payment gateway, orders, ticket delivery, and box-office and check-in tools. SeatLayer operates the ticketing software and infrastructure; you configure your event, prices and policies, support your buyers and supply event staff.
- **Ticketing platforms:** embed the ready-made **Venue Designer**, **buyer SeatPicker** and **Control Room / SeatManager** inside your own system under your brand, whether an application, admin portal or CMS. Workspaces isolate each tenant's charts and events; your backend authorizes the scoped sessions. Your platform keeps checkout, payments, orders and tickets.

This is a seated-event product, not general-purpose event management or pure-GA ticketing without a seating chart. A SeatLayer-hosted event page is an optional distribution choice; selling from the organizer's existing website is the primary Hosted Ticketing journey.

[Sell seated-event tickets on your website](https://seatlayer.io/sell-tickets-on-your-website/) · [Product features](https://seatlayer.io/features/) · [Embedded Designer](https://docs.seatlayer.io/platform/embedded-designer/) · [Embedded Control Room](https://docs.seatlayer.io/platform/embedded-control-room/) · [Workspace isolation](https://docs.seatlayer.io/platform/workspaces/)

## Verify the evidence

This repository publishes first-party **renderer and single-event concurrency benchmarks**, with dated measurements and methods. The synthetic charts are test fixtures, not customer deployments. Each report defines its workload and measurement scope.

- [Evidence guide](EVIDENCE.md): what each result supports, fixture versions, and how to inspect the run logs.
- [LLM-readable index](llms.txt): product scope, capability sources, benchmark and demo links.
- [Public knowledge MCP](https://docs.seatlayer.io/mcp): read-only product, capability, pricing and renderer-evidence answers with sources.
- [Documentation index](https://docs.seatlayer.io/llms.txt) · [Marketing index](https://seatlayer.io/llms.txt).

## Stadium scale measured

| Seats | Chart ready | Zoom in/out | Pan |
| ---: | ---: | ---: | ---: |
| 100,000 | 1.02 s | 58.6 FPS | 60.0 FPS |
| 150,000 | 1.44 s | 58.6 FPS | 60.0 FPS |
| 200,000 | 1.95 s | 57.6 FPS | 60.0 FPS |

Results are medians of three runs per chart on an optimized production build, Chrome 152, 1280 × 720, DPR 2. Chart ready means the section overview is usable; seat graphics load as buyers explore. [Read the benchmark and methodology](results/2026-09-15/stadium-scale-benchmark.md) · [Inspect all nine runs](results/2026-09-15/runs/)

## Tested at 10,000 concurrent buyers

- **10,000 simulated concurrent buyers** on one 12,000-seat event: engine-side hold latency p99 9 ms, zero server errors.
- **10,000 connected viewers, ten writers:** 400,000 of 400,000 live seat updates delivered, p95 383 ms.
- **3,552 requests per second** sustained for two minutes on one event.

Measured in an isolated engine harness on a single workstation; method, scripts and raw summaries are in this repository.

[Read the concurrency benchmark, method and limits](results/2026-09-18/concurrency-benchmark.md)

## Explore the venues

- [Try the 100,000-seat Century Stadium live](https://app.seatlayer.io/demo/play/century-stadium-100k): the same fixture as `century-stadium.json`, published to the public demo catalog on 16 September 2026.
- The arena demo above uses the same fixture as `venues/v1.1/century-arena.json` (Century Arena 2.0.0), published to the public demo catalog on 16 September 2026.
- [Try the 150,000-seat Century Stadium live](https://app.seatlayer.io/demo/play/century-stadium-150k): the same fixture as `century-stadium-150k.json`, published to the public demo catalog on 16 September 2026.
- The largest stadium demo above uses the same fixture as `century-stadium-200k.json`, published to the public demo catalog on 16 September 2026.
- [Try the 53,018-seat stadium demo](https://app.seatlayer.io/demo/play/large-stadium).
- Download the [100K stadium](venues/v1/century-stadium.json), [100K arena](venues/v1.1/century-arena.json), [150K stadium](venues/v1/century-stadium-150k.json), or [200K stadium](venues/v1/century-stadium-200k.json).
- Each stadium benchmark contains **200 sections**. [Fixture sizes, inventory counts and SHA-256 hashes](venues/v1/manifest.json) identify the exact charts tested.
- The arena link points at Century Arena 2.0.0, a caption-only revision published on 16 September 2026. The 14 September arena benchmark measured [Century Arena 1.0.0](venues/v1/century-arena.json), which stays published unchanged; its re-run on 2.0.0 is pending. [Fixture versions](venues/README.md#fixture-versions).

These original synthetic venues provide repeatable, customer-data-free fixtures for evaluating large seating charts.

## More evidence

- [100K stadium and arena benchmark, 14 September 2026](results/2026-09-14/century-100k-browser-benchmark.md)
- [Event isolation architecture](architecture/event-isolation.md): how events own their inventory and session streams
- [Renderer performance documentation](https://docs.seatlayer.io/platform/renderer-performance/)
- [Browser measurement method](benchmarks/browser/README.md)

## Build on it

- Documentation: [renderer performance](https://docs.seatlayer.io/platform/renderer-performance/) · [concurrency benchmark](https://docs.seatlayer.io/platform/concurrency-performance/) · [install the buyer SDK](https://docs.seatlayer.io/buyer-sdk/install/)
- SDKs and examples: [seatlayer-sdk](https://github.com/seatlayer/seatlayer-sdk) · [React example](https://github.com/seatlayer/seatlayer-react-example) · [Next.js example](https://github.com/seatlayer/seatlayer-nextjs-example) · [Flutter](https://github.com/seatlayer/seatlayer-flutter) · [iOS](https://github.com/seatlayer/seatlayer-ios) · [Android](https://github.com/seatlayer/seatlayer-android) · [React Native](https://github.com/seatlayer/seatlayer-react-native) · [WordPress](https://github.com/seatlayer/seatlayer-wordpress)
- [How SeatLayer compares with seats.io](https://seatlayer.io/vs/seats-io/)

## How to cite

Cite this repository and the dated result file; each result names its build revision and fixture SHA-256.

## License

Benchmark materials and synthetic venue fixtures are available under the [MIT License](LICENSE). The separately distributed SeatLayer SDK has its own license; see [NOTICE.md](NOTICE.md).
