#!/usr/bin/env node
// Builds dashboard/data/arkreen-monthly.json — monthly solar generation (kWh) per site.
//
// Arkreen exposes per-day energy history only for "Standard" miners (minerType 4). Sites that run
// only "Remote" miners (minerType 2) report a cumulative total with no history, so they have no
// monthly series. The owner-level "energy" total (used for the headline number) counts Remote miners
// only, so the Standard miners' lifetime energy is returned here as `standardKwh` to be added on top.
//
// Usage: node scripts/fetch-arkreen-monthly.mjs   (run scripts/fetch-arkreen-miners.sh first)

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://costdownapi.arkreen.com/v1';
const STANDARD = 4;
// Same raw → kWh scale as fetch-arkreen-miners.sh (best-effort, undocumented by Arkreen)
const ENERGY_TO_KWH = 1e6;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function rpc(method, params) {
  for (let i = 0; i < 4; i++) {
    const res = await fetch(API, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    });
    if (res.ok) {
      const j = await res.json();
      if (j.error) throw new Error(`${method}: ${j.error.message}`);
      return j.result;
    }
    await sleep(1500 * (i + 1));
  }
  throw new Error(`gave up: ${method}`);
}

// Last 6 complete calendar months (UTC), oldest first, e.g. ['2026-05', …, '2026-10']
const now = new Date();
const months = [];
for (let i = 6; i >= 1; i--) {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
  months.push(d.toISOString().slice(0, 7));
}

const { miners: sites } = JSON.parse(readFileSync(path.join(root, 'dashboard/data/arkreen-miners.json'), 'utf8'));

const out = [];
for (const site of sites) {
  const list = await rpc('agg_queryMinersDetailByOwner', { owner: site.address, page: 1, limit: 100, minerType: STANDARD });
  const std = list.items || [];
  const byMonth = Object.fromEntries(months.map((m) => [m, 0]));
  let firstDate = null;
  for (const m of std) {
    for (let page = 1; ; page++) {
      const r = await rpc('agg_queryMinerDailyEnergy', { miner_address: m.address, page, limit: 100, minerType: STANDARD });
      for (const it of r.items || []) {
        const mo = it.date.slice(0, 7);
        if (mo in byMonth) byMonth[mo] += it.daily_energy / ENERGY_TO_KWH;
        if (!firstDate || it.date < firstDate) firstDate = it.date;
      }
      if (!(r.items || []).length || page >= (r.totalPages || 1)) break;
      await sleep(150);
    }
  }
  const standardKwh = std.reduce((s, m) => s + (m.total_energy || 0), 0) / ENERGY_TO_KWH;
  const hasHistory = std.length > 0;
  out.push({
    name: site.name,
    address: site.address,
    hasHistory,
    historyFrom: firstDate,
    standardKwh: Math.round(standardKwh * 100) / 100,
    monthly: hasHistory ? Object.fromEntries(Object.entries(byMonth).map(([k, v]) => [k, Math.round(v * 10) / 10])) : null,
  });
  console.log(`  ${site.name}: ${hasHistory ? `from ${firstDate}, ${JSON.stringify(out.at(-1).monthly)}` : 'no daily history (remote miners only)'}`);
}

writeFileSync(path.join(root, 'dashboard/data/arkreen-monthly.json'),
  JSON.stringify({ months, sites: out, fetchedAt: new Date().toISOString() }, null, 2) + '\n');
console.log(`Wrote dashboard/data/arkreen-monthly.json (${out.filter((s) => s.hasHistory).length}/${out.length} sites with history)`);
