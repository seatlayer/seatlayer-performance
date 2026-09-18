// usage: node analyze.mjs <raw.json> <plateauStartSec> <plateauEndSec> <outStagesJson> <outErrorCodesJson>
import {createReadStream, writeFileSync} from 'node:fs';
import {createInterface} from 'node:readline';
const [raw, ps, pe, outStages, outErr] = process.argv.slice(2);
const PS = Number(ps), PE = Number(pe);
let t0 = null;
const routes = {};          // route -> {dur:[], reqs, failed}
const rpc = {availability:[],objects:[],hold:[]};
const errCodesAll = {}, errCodesPlateau = {};
const counters = {hold_ok:0, hold_refused:0, http_5xx:0};
const vusPlateau = [];
let plateauReqs = 0, plateauFailed = 0, totalReqs = 0, totalFailed = 0;
let firstPlateauTime = null, lastPlateauTime = null;
const rl = createInterface({input: createReadStream(raw), crlfDelay: Infinity});
for await (const line of rl) {
  if (!line || line[0] !== '{') continue;
  let p; try { p = JSON.parse(line); } catch { continue; }
  if (p.type !== 'Point') continue;
  const d = p.data, tags = d.tags || {};
  const ts = Date.parse(d.time) / 1000;
  if (t0 === null) t0 = ts;
  const rel = ts - t0;
  const inP = rel >= PS && rel <= PE;
  const m = p.metric;
  if (m === 'http_reqs') {
    totalReqs += d.value;
    if (inP) { plateauReqs += d.value; if (firstPlateauTime===null) firstPlateauTime=ts; lastPlateauTime=ts; }
    const ec = tags.error_code;
    if (ec) { errCodesAll[ec] = (errCodesAll[ec]||0)+d.value; if (inP) errCodesPlateau[ec]=(errCodesPlateau[ec]||0)+d.value; }
  } else if (m === 'http_req_failed') {
    totalFailed += d.value;
    if (inP) plateauFailed += d.value;
  } else if (m === 'http_req_duration') {
    if (!inP) continue;
    const r = tags.route || 'other';
    (routes[r] ||= []).push(d.value);
  } else if (m === 'rpc_ms_availability') { if (inP) rpc.availability.push(d.value); }
  else if (m === 'rpc_ms_objects') { if (inP) rpc.objects.push(d.value); }
  else if (m === 'rpc_ms_hold') { if (inP) rpc.hold.push(d.value); }
  else if (m === 'hold_ok') { if (inP) counters.hold_ok += d.value; }
  else if (m === 'hold_refused') { if (inP) counters.hold_refused += d.value; }
  else if (m === 'http_5xx') { if (inP) counters.http_5xx += d.value; }
  else if (m === 'vus') { if (inP) vusPlateau.push(d.value); }
}
const q = (a,p)=>{ if(!a.length) return null; const s=[...a].sort((x,y)=>x-y); const i=Math.min(s.length-1, Math.ceil(p*s.length)-1); return Math.round(s[Math.max(0,i)]*1000)/1000; };
const st = a => a.length ? {n:a.length, p50:q(a,.5), p95:q(a,.95), p99:q(a,.99), max:q(a,1)} : null;
const dur = (lastPlateauTime-firstPlateauTime) || (PE-PS);
const out = {
  plateauWindowSec: [PS, PE],
  plateauSpanSecondsObserved: Math.round(dur*10)/10,
  vusPlateau: {min: Math.min(...vusPlateau), max: Math.max(...vusPlateau), samples: vusPlateau.length},
  plateau: {
    httpRequests: plateauReqs,
    httpRequestsPerSecond: Math.round((plateauReqs/dur)*10)/10,
    httpFailed: plateauFailed,
    httpFailedRate: plateauReqs ? Math.round((plateauFailed/plateauReqs)*1e6)/1e6 : 0,
    http5xx: counters.http_5xx,
    holdOk: counters.hold_ok,
    holdRefused: counters.hold_refused,
    rpcMs: {availability: st(rpc.availability), objects: st(rpc.objects), hold: st(rpc.hold)},
    httpMsByRoute: Object.fromEntries(Object.entries(routes).map(([k,v])=>[k, st(v)])),
  },
  wholeRun: {httpRequests: totalReqs, httpFailed: totalFailed, httpFailedRate: totalReqs? Math.round((totalFailed/totalReqs)*1e6)/1e6 : 0},
};
writeFileSync(outStages, JSON.stringify(out, null, 2));
writeFileSync(outErr, JSON.stringify({wholeRun: errCodesAll, plateau: errCodesPlateau}, null, 2));
console.log(JSON.stringify(out, null, 2));
console.log('error codes', JSON.stringify({wholeRun: errCodesAll, plateau: errCodesPlateau}));
