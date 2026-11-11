#!/usr/bin/env node
// Builds static snapshots of Blockscout-backed blocks so browsers never hit its 429 rate limit:
//   dashboard/data/hypercerts.json   (fetchHypercertsData)
//   dashboard/data/sarafu-pools.json (fetchSarafuData)
// It runs the dashboard's own fetch functions from api.js, with a throttled, retrying fetch.
// INAT has its own script: scripts/fetch-inat.mjs
// Usage: node scripts/fetch-chain-snapshots.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Serialize requests (~3/s) and retry on 429/5xx with backoff
const realFetch = globalThis.fetch;
let chain = Promise.resolve();
function politeFetch(url, opts) {
  opts = undefined; // drop the browser-side 15s abort signal: retries here take longer than that
  const run = async () => {
    for (let i = 0; i < 6; i++) {
      const res = await realFetch(url, opts);
      if (res.status !== 429 && res.status < 500) { await sleep(300); return res; }
      await sleep(2000 * (i + 1));
    }
    return realFetch(url, opts);
  };
  const p = chain.then(run, run);
  chain = p.catch(() => {});
  return p;
}

const ctx = vm.createContext({
  fetch: politeFetch, AbortController, URL, URLSearchParams, setTimeout, clearTimeout,
  console, performance, Promise, Set, Math, Date, JSON, parseInt, Array, Object,
});
vm.runInContext(readFileSync(path.join(root, 'dashboard/js/api.js'), 'utf8'), ctx);

const stamp = () => new Date().toISOString();
async function snapshot(name, fn, file) {
  console.log(`Fetching ${name}...`);
  const data = await vm.runInContext(`${fn}()`, ctx);
  writeFileSync(path.join(root, 'dashboard/data', file), JSON.stringify({ ...data, fetchedAt: stamp() }, null, 2) + '\n');
  return data;
}

const hc = await snapshot('Hypercerts', 'fetchHypercertsData', 'hypercerts.json');
console.log(`  hypercerts: ${hc.certs.length} certs, ${hc.totalClaims} claims`);

const sr = await snapshot('Sarafu pools', 'fetchSarafuData', 'sarafu-pools.json');
const failed = sr.pools.filter((p) => p.error).map((p) => p.name);
console.log(`  sarafu: ${sr.totalPools} pools, ${sr.totalTransactions} tx${failed.length ? `, FAILED: ${failed.join(', ')}` : ''}`);
if (failed.length) process.exitCode = 1;
