# Browser renderer benchmark

This benchmark treats SeatLayer as a public SDK consumer would. It uses only:

- the released `SeatPicker` constructor and documented methods;
- the public `onAnalytics` callback for renderer milestones; and
- browser `requestAnimationFrame` timestamps around scripted user interactions.

It must not inspect renderer internals, private scene nodes, hidden diagnostic
objects, or product source code. That keeps the public method reproducible by an
integrator using the published package.

## Setup

Before running the example:

1. Select an actually published stable `@seatlayer/js` release.
2. Record the exact version and immutable package source used by the page.
3. Verify `SeatPicker`, `onAnalytics`, the interaction methods, and emitted
   milestone names against that release's public documentation.
4. Use a public synthetic event or a local demo transport that contains no
   credentials, customer data, or private identifiers.
5. Run a production bundle in a foreground browser tab.

## Public API boundary

The page uses the released UMD build's public `SeatPicker` constructor with a
fresh local `PickerTransport`, `loadingReveal: 'viewport'`, `onAnalytics`, and
the controls visible inside the picker. It does not read a controller, renderer,
scene graph, private property, or diagnostic global.

The transport reports every object as free and exposes no socket. Hold and Best
Available calls reject with a read-only benchmark error; the page is not a
booking-system simulation. The released package determines which milestone
properties are available. The harness records the callback payload and states
its timer boundary; viewport mode has no all-seats-materialized milestone.

## Frame sampling

Start the animation-frame sampler before invoking each interaction so the first
synchronous delay is included:

```js
async function sampleFrames(action, settleMs) {
  const frames = [];
  let previous = performance.now();
  let running = true;

  function sample(now) {
    frames.push(now - previous);
    previous = now;
    if (running) requestAnimationFrame(sample);
  }

  requestAnimationFrame(sample);
  action();
  await new Promise((resolve) => setTimeout(resolve, settleMs));
  running = false;
  return frames;
}
```

The implementation must stop sampling deterministically and discard the
initial scheduling interval only when the written method justifies it. Raw
frame intervals remain in the run artifact. Summaries report sample count,
p50, p95, maximum, and frames above the declared budget.

## Manual interaction sequence

The page records 30 seconds while the person uses the visible picker to zoom and
pan. Each raw run records that the action sequence was manual.

## Repetition and output

- Run at least one warm-up that is labelled and excluded from the reported
  distribution.
- Preserve every measured repetition, including slow, failed, and aborted runs.
- Record desktop and narrow viewports separately.
- Keep local production-build and deployed-production results in separate
  summaries.
- Write each run against [`results/run-manifest.schema.json`](../../results/run-manifest.schema.json).
