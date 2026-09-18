// Extended viewer fan-out, 2026-09-18 run-15k series.
// Same workload as fanout.mjs (12,000 seats, 40 distinct-seat holds per stage in
// four bursts of ten concurrent writers, 10 s delivery observation deadline),
// with the stage list extended past 2,000 connected viewers.
// Stages and output path are overridable: STAGES=100,500 OUT=/path node fanout-extended.mjs
import {writeFileSync} from 'node:fs';
const base='http://127.0.0.1:8799',event='fanout-ext-'+Date.now();
const STAGES=(process.env.STAGES??'100,500,1000,2000,5000,10000').split(',').map(Number);
const OUT=process.env.OUT??'/tmp/seatlayer-fanout-extended.json';
async function post(path,body){const r=await fetch(base+path+'?event='+event,{method:'POST',body:JSON.stringify(body),headers:{'content-type':'application/json'}});if(!r.ok)throw Error('HTTP '+r.status);return r.json()}
const mx=a=>a.reduce((m,v)=>v>m?v:m,-Infinity);
const q=(a,p)=>a.length?[...a].sort((a,b)=>a-b)[Math.min(a.length-1,Math.floor(a.length*p))]:null;
await post('/setup',{seats:12000,channels:0,perChannel:0});
const clients=[],pending=new Map(),results=[];let closed=0;
try{for(const count of STAGES){
 let openError=null;
 try{
  while(clients.length<count){const w=new WebSocket(base.replace('http','ws')+'/subscribe?event='+event+'&surface=picker&viewerId=bench-'+clients.length+'-aaaaaaaa',['seatlayer.v1']);
  w.addEventListener('message',e=>{const f=JSON.parse(e.data);if(f.type==='delta')for(const c of f.changes??[]){const p=pending.get(c.label);if(p&&!p.seen.has(w)){p.seen.add(w);p.latencies.push(performance.now()-p.start)}}});
  w.addEventListener('close',()=>closed++);w.addEventListener('error',()=>{});
  await new Promise((r,j)=>{w.addEventListener('open',r,{once:true});w.addEventListener('error',j,{once:true})});clients.push(w)}
 }catch(e){openError=String(e&&e.message||e)}
 const connected=clients.length;
 const latencies=[],http=[],holds=[];let failures=0;
 for(let batch=0;batch<4;batch++){
 await Promise.all(Array.from({length:10},async(_,i)=>{const label='S-'+(count+batch*10+i+1);pending.set(label,{start:performance.now(),seen:new Set(),latencies});const t=performance.now();const h=await post('/hold',{labels:[label]});http.push(performance.now()-t);if(!h.ok)failures++;else holds.push({labels:[label],holdId:h.holdId})}));
 const deadline=performance.now()+10000;while([...pending.values()].some(p=>p.seen.size<connected)&&performance.now()<deadline)await new Promise(r=>setTimeout(r,10));
 }
 const missing=[...pending.values()].reduce((n,p)=>n+connected-p.seen.size,0);pending.clear();
 await Promise.all(holds.map(h=>post('/release',h)));
 const result={requestedSockets:count,connectedSockets:connected,openError,concurrentWriters:10,holds:40,failures,closed,expectedDeliveries:connected*40,receivedDeliveries:latencies.length,missing,holdP50:q(http,.5),holdP95:q(http,.95),holdMax:mx(http),deltaP50:q(latencies,.5),deltaP95:q(latencies,.95),deltaP99:q(latencies,.99),deltaMax:latencies.length?mx(latencies):null};results.push(result);console.log(JSON.stringify(result));
 writeFileSync(OUT,JSON.stringify(results,null,2));
 if(openError)break;
}}finally{for(const w of clients){try{w.close()}catch{}}}
