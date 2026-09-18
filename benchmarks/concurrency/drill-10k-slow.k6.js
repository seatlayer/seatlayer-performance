// Local-only isolated-harness probe, 2026-09-18.
// Same request mix and think time as the earlier drill script; slower ramp to 10,000 VUs.
// 120 s ramp, 120 s plateau at 10,000 VUs, 20 s ramp down; no sockets.
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';

const BASE = __ENV.BASE || 'http://127.0.0.1:8799';
const EVENT = __ENV.EVENT || 'drill-10k-slow';
const SEATS = Number(__ENV.SEATS || 12000);
const TARGET = Number(__ENV.TARGET || 10000);
const RAMP = __ENV.RAMP || '120s';
const HOLD = __ENV.HOLD || '120s';
const DOWN = __ENV.DOWN || '20s';

const engineAvail = new Trend('engine_ms_availability', true);
const engineObjects = new Trend('engine_ms_objects', true);
const engineHold = new Trend('engine_ms_hold', true);
const holdRefused = new Counter('hold_refused');
const holdOk = new Counter('hold_ok');
const errors5xx = new Counter('http_5xx');

export const options = {
  discardResponseBodies: false,
  noConnectionReuse: false,
  scenarios: {
    ramp: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: RAMP, target: TARGET },
        { duration: HOLD, target: TARGET },
        { duration: DOWN, target: 0 },
      ],
      gracefulRampDown: '20s',
    },
  },
  thresholds: {
    'http_req_duration{route:availability}': ['p(99)<600000'],
    'http_req_duration{route:objects}': ['p(99)<600000'],
    'http_req_duration{route:hold}': ['p(99)<600000'],
    'http_req_duration{route:release}': ['p(99)<600000'],
    'http_req_failed{route:availability}': ['rate<1'],
    'http_req_failed{route:objects}': ['rate<1'],
    'http_req_failed{route:hold}': ['rate<1'],
    'http_req_failed{route:release}': ['rate<1'],
  },
  summaryTrendStats: ['avg', 'p(50)', 'p(95)', 'p(99)', 'max'],
};

function engineMs(res, trend) {
  const ms = Number(res.headers['X-Engine-Ms'] ?? res.headers['x-engine-ms']);
  if (Number.isFinite(ms)) trend.add(ms);
  if (res.status >= 500) errors5xx.add(1);
}

export function setup() {
  const r = http.post(`${BASE}/setup?event=${EVENT}`, JSON.stringify({ seats: SEATS, channels: 0, perChannel: 0 }), { headers: { 'content-type': 'application/json' } });
  if (r.status !== 200) throw new Error(`setup failed ${r.status} ${r.body}`);
  return {};
}

export default function () {
  const q = `?event=${EVENT}`;
  const a = http.get(`${BASE}/availability${q}`, { tags: { route: 'availability' } });
  check(a, { 'availability 200': (r) => r.status === 200 });
  engineMs(a, engineAvail);
  if (Math.random() < 0.3) {
    const o = http.get(`${BASE}/objects${q}`, { tags: { route: 'objects' } });
    engineMs(o, engineObjects);
  }
  if (Math.random() < 0.05) {
    const n = 1 + Math.floor(Math.random() * 2);
    const labels = Array.from({ length: n }, () => `S-${1 + Math.floor(Math.random() * SEATS)}`);
    const h = http.post(`${BASE}/hold-timed${q}`, JSON.stringify({ labels }), { headers: { 'content-type': 'application/json' }, tags: { route: 'hold' } });
    engineMs(h, engineHold);
    let body = null;
    try { body = JSON.parse(h.body); } catch {}
    if (body && body.ok) {
      holdOk.add(1);
      sleep(1 + Math.random() * 2);
      http.post(`${BASE}/release${q}`, JSON.stringify({ labels, holdId: body.holdId }), { headers: { 'content-type': 'application/json' }, tags: { route: 'release' } });
    } else holdRefused.add(1, { reason: String(body?.code ?? body?.error ?? 'unknown') });
  }
  sleep(1.5 + Math.random());
}
