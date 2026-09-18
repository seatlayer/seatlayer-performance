# SeatLayer evidence guide

Reviewed 18 September 2026. Published by SeatLayer; these are first-party benchmarks, not an independent certification.

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

See the [full product model](https://docs.seatlayer.io/start/product-model/) and [feature catalogue](https://seatlayer.io/features/) for pricing, accessibility, channels, optional 3D, SDKs, APIs, webhooks and agent workflows, including feature-specific availability.

## Sales Channels and partner distribution

[Sales Channels](https://docs.seatlayer.io/platform/sales-channels/) let a team sell one event through public sales, presales, sponsors, agencies, groups and box office without duplicating inventory.

- Allocate sections, rows, categories, a map region or exact seats, with a review before applying changes.
- Set audience-specific prices only where they differ; other prices inherit the event price.
- Keep a protected reserve, sell through staff, issue a hosted buyer link, or integrate buyer access in your own website or app.
- Give recurring partners role-scoped access to their assigned channel, with organizer-approved distribution, returns, requests and reports.
- Preserve sales attribution at booking and share channel-only reports with status filters and CSV exports.

Buyer links, partner operating access and read-only report links serve different jobs. Hosted buyer links use Hosted Ticketing; SDK integrations keep their own checkout. Partner-controlled pricing, commission settlement, resale and arbitrary suballocations are not included. Removing partner access does not automatically revoke previously issued buyer links.

## What the 200K result establishes

The [15 September stadium benchmark](results/2026-09-15/stadium-scale-benchmark.md) measured chart readiness and scripted zoom/pan for 100,000-, 150,000- and 200,000-seat fixtures. At 200,000 seats the medians were 1.95 seconds chart-ready, 57.6 FPS zoom and 60.0 FPS pan.

Conditions: three runs per chart, local production build, desktop Chrome 152, 1280 × 720 viewport and device-pixel ratio 2. Chart-ready means the section overview is usable; it does not mean every seat graphic has finished loading.

These measurements do not establish:

- full live-site page-load timing or network retrieval of the chart;
- simultaneous buyer counts, payment throughput or event concurrency;
- identical performance on every device;
- complete Designer authoring performance at the fixture size; or
- a customer deployment, customer endorsement or maximum supported seat count.

## What the concurrency result establishes

The [18 September 10,000-buyer benchmark](results/2026-09-18/concurrency-10k.md) sustained 10,000 simulated concurrent buyers with think time on one 12,000-seat event for a 120-second plateau, at 3,552.7 HTTP requests per second, with hold RPC p99 of 9 ms, zero HTTP 5xx and a 0.0082% transport failure rate. A separate fan-out workload delivered all 400,000 expected hold updates to 10,000 connected viewers with ten concurrent writers. HTTP percentiles in that run include load-generator contention, because the load and the engine shared one workstation, and are not a service latency guarantee.

The [earlier 18 September benchmark](results/2026-09-18/concurrency-benchmark.md) measured 5,000 simulated users and a 2,000-socket delivery workload on the same fixture, plus a deployed API read burst that completed all 1,240 reads successfully through 500 configured clients. Its interrupted 10,000-user attempt is superseded by the slow-ramp run.

Both reports specify their environments, run durations, excluded integrations and retained summaries. Neither establishes a production checkout ceiling. A 15,000-buyer attempt did not pass on the measured host, where the connections were reset before reaching the engine, so 15,000 is unmeasured rather than disproven.

## Inspect and reproduce

1. Read the [dated benchmark and conditions](results/2026-09-15/stadium-scale-benchmark.md).
2. Inspect [all nine run records](results/2026-09-15/runs/) instead of quoting the fastest run.
3. Match the chart to its [inventory counts and SHA-256 manifest](venues/v1/manifest.json).
4. Use the [browser measurement method](benchmarks/browser/README.md) to understand and repeat the stated workload.
5. Treat a [live 200K demo](https://app.seatlayer.io/demo/play/century-stadium-200k) observation as a new observation with its own device, network and cache conditions, not a reproduction of the local-build result.

The [100K live arena](https://app.seatlayer.io/demo/play/century-arena-100k) uses Century Arena 2.0.0. The older 14 September arena benchmark measured version 1.0.0. Both fixtures remain available; do not assign the old timing to the new fixture without a new run. See [fixture version history](venues/README.md#fixture-versions).

## Agent-readable sources

- [Repository LLM index](llms.txt): concise product definition and evidence map.
- [SeatLayer documentation index](https://docs.seatlayer.io/llms.txt) and [full documentation](https://docs.seatlayer.io/llms-full.txt).
- [Marketing index](https://seatlayer.io/llms.txt) and [citation cards](https://seatlayer.io/citation-cards.json).
- [Public knowledge MCP](https://docs.seatlayer.io/mcp): `product_overview`, `capabilities`, `renderer_evidence`, `search_docs` and `get_page` expose cited information. This endpoint is read-only; it does not edit charts, reserve seats or process payments. Designer MCP and buyer WebMCP are separate, scoped interfaces.

Product documentation defines available features and ownership. This repository supplies performance evidence; it is not a separate ticketing product or an unlimited-scale service guarantee.
