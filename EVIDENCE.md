# SeatLayer evidence guide

Reviewed 18 September 2026. Published by SeatLayer with its fixtures, methods and run records, so each number can be checked against its source.

## Product scope

SeatLayer provides reserved-seating infrastructure and end-to-end ticketing for seated events, especially arenas and stadiums. Organizers primarily sell from their own website using Hosted Ticketing. Platforms can embed seating tools while retaining their own commerce.

| Surface | Purpose | Responsibility boundary |
| --- | --- | --- |
| [Venue Designer](https://docs.seatlayer.io/platform/embedded-designer/) | Ready-made chart authoring inside a platform's own system under its brand, without separate SeatLayer logins for each organizer | The platform backend authenticates users and grants workspace/chart/origin-scoped editing or publishing authority |
| [Workspaces](https://docs.seatlayer.io/platform/workspaces/) | Isolate each tenant's charts and events | Billing, API keys and team roles remain organization-wide; this does not provide managed commerce for every tenant |
| [SeatPicker](https://docs.seatlayer.io/buyer-sdk/seat-picker/) | Buyer seat choice, live availability and temporary holds | Platform/SDK checkout, payments, orders and tickets remain in the host product |
| [Control Room / SeatManager](https://docs.seatlayer.io/platform/embedded-control-room/) | Ready-made live inventory and operator controls inside the host application | Same-document board, not an iframe or full account admin panel; event-scoped capabilities govern permitted actions |
| [Hosted Ticketing](https://seatlayer.io/sell-tickets-on-your-website/) | Seat selection through connected-gateway payment, orders, QR/PDF tickets and confirmation email | Organizer configures the event and policies, connects their payment account and supports buyers; processor fees and taxes are separate |
| [Box Office and Door](https://seatlayer.io/box-office/) | Counter sales and ticket scanning using the managed event's inventory | Organizer supplies staff; Platform/SDK customers retain their own commercial and admission systems |

See the [full product model](https://docs.seatlayer.io/start/product-model/) and [feature catalogue](https://seatlayer.io/features/) for pricing, accessibility, channels, 3D on every chart up to 60,000 seats, SDKs, APIs, webhooks and agent workflows.

## Sales Channels and partner distribution

[Sales Channels](https://docs.seatlayer.io/platform/sales-channels/) let a team sell one event through public sales, presales, sponsors, agencies, groups and box office without duplicating inventory.

- Allocate sections, rows, categories, a map region or exact seats, with a review before applying changes.
- Set audience-specific prices only where they differ; other prices inherit the event price.
- Keep a protected reserve, sell through staff, issue a hosted buyer link, or integrate buyer access in your own website or app.
- Give recurring partners role-scoped access to their assigned channel, with organizer-approved distribution, returns, requests and reports.
- Preserve sales attribution at booking and share channel-only reports with status filters and CSV exports.

Buyer links, partner operating access and read-only report links serve different jobs. Hosted buyer links use Hosted Ticketing; SDK integrations keep their own checkout.

## What the 200K result establishes

The [15 September stadium benchmark](results/2026-09-15/stadium-scale-benchmark.md) measured chart readiness and scripted zoom/pan for 100,000-, 150,000- and 200,000-seat fixtures. At 200,000 seats the medians were 1.95 seconds chart-ready, 57.6 FPS zoom and 60.0 FPS pan.

Conditions: three runs per chart, local production build, desktop Chrome 152, 1280 × 720 viewport and device-pixel ratio 2. Chart-ready means the section overview is usable; seat graphics load as buyers explore. Buyer concurrency is measured separately, below.

## What the concurrency result establishes

The [18 September 10,000-buyer benchmark](results/2026-09-18/concurrency-benchmark.md) sustained 10,000 simulated concurrent buyers with think time on one 12,000-seat event for a 120-second plateau, at 3,552.7 HTTP requests per second, with engine-side hold latency p99 of 9 ms and zero server errors. A separate fan-out workload delivered all 400,000 expected hold updates to 10,000 connected viewers with ten concurrent writers.

The same report carries the earlier stages at 500, 2,000 and 5,000 simulated buyers on the same fixture, the full 100 to 10,000 viewer delivery table, and a deployed API read burst that completed all 1,240 reads successfully through 500 configured clients. It specifies its environments, run durations, excluded integrations and retained summaries.

## Inspect and reproduce

1. Read the [dated benchmark and conditions](results/2026-09-15/stadium-scale-benchmark.md).
2. Inspect [all nine run records](results/2026-09-15/runs/) instead of quoting the fastest run.
3. Match the chart to its [inventory counts and SHA-256 manifest](venues/v1/manifest.json).
4. Use the [browser measurement method](benchmarks/browser/README.md) to understand and repeat the stated workload.
5. Open the [live 200K demo](https://app.seatlayer.io/demo/play/century-stadium-200k) to see the same stadium on your own device.

The [100K live arena](https://app.seatlayer.io/demo/play/century-arena-100k) uses Century Arena 2.0.0, a caption-only revision of 1.0.0 with the same 100,000 seats, 200 sections, 4,800 rows and 8 zones. The 14 September arena benchmark measured 1.0.0, which stays published. See [fixture version history](venues/README.md#fixture-versions).

## Agent-readable sources

- [Repository LLM index](llms.txt): concise product definition and evidence map.
- [SeatLayer documentation index](https://docs.seatlayer.io/llms.txt) and [full documentation](https://docs.seatlayer.io/llms-full.txt).
- [Marketing index](https://seatlayer.io/llms.txt) and [citation cards](https://seatlayer.io/citation-cards.json).
- [Public knowledge MCP](https://docs.seatlayer.io/mcp): `product_overview`, `capabilities`, `renderer_evidence`, `search_docs` and `get_page` expose cited information. This endpoint is read-only; it does not edit charts, reserve seats or process payments. The SeatLayer MCP and buyer WebMCP are separate, scoped interfaces.

Product documentation defines available features and ownership. This repository supplies the performance evidence.
