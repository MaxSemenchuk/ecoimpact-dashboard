#!/usr/bin/env node
// Builds dashboard/data/inat.json — a static snapshot of INAT eco-credit sales on Celo.
// The browser can't query Blockscout reliably (HTTP 429 rate limits), so the dashboard
// loads this snapshot instead (same pattern as arkreen-miners.json / sarafu-reports.json).
// Usage: node scripts/fetch-inat.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const apiSrc = readFileSync(path.join(root, 'dashboard/js/api.js'), 'utf8');

// Reuse the INAT config from api.js so there is a single source of truth
const cfgMatch = apiSrc.match(/\n  inat: (\{[\s\S]*?\n  \}),\n  giveth:/);
if (!cfgMatch) throw new Error('Could not locate inat config in api.js');
const cfg = new Function(`return (${cfgMatch[1]})`)();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, tries = 5) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url);
    if (res.ok) return res.json();
    if (res.status !== 429 && res.status < 500) throw new Error(`${res.status} ${url}`);
    await sleep(1500 * (i + 1));
  }
  throw new Error(`gave up: ${url}`);
}

// Marketplace is an ERC1967 proxy: Blockscout no longer decodes its methods, so match raw selectors.
const SEL = { buyCredits: '0x479c8457', createListing: '0xebc34929', cancelListing: '0x305a67a8' };
const word = (input, i) => BigInt('0x' + (input.slice(10 + i * 64, 10 + (i + 1) * 64) || '0'));

// Follow pagination (50 tx per page)
const items = [];
let next = '';
for (let page = 0; page < 40; page++) {
  const r = await get(`${cfg.v2BaseUrl}/addresses/${cfg.marketplace}/transactions${next}`);
  items.push(...(r.items || []));
  if (!r.next_page_params) break;
  next = '?' + new URLSearchParams(r.next_page_params).toString();
  await sleep(300);
}
const marketplaceTxs = { items };
// Informational only (not shown in the UI) — don't fail the snapshot if it is rate-limited
const carbonTxs = { result: new Array(parseInt((await get(`${cfg.v2BaseUrl}/addresses/${cfg.carbonBatch}/counters`, 3).catch(() => ({}))).transactions_count || '0', 10)) };

const allTxs = marketplaceTxs.items || [];
const ok = (t) => t.status === 'ok';
const sel = (t) => (t.raw_input || '').slice(0, 10).toLowerCase();
const purchases = [];
for (const tx of allTxs.filter((t) => ok(t) && sel(t) === SEL.buyCredits)) {
  const raw = tx.raw_input;
  const listingId = { value: word(raw, 0).toString() };
  const amount = { value: word(raw, 1).toString() };
  const transfers = (await get(`${cfg.v2BaseUrl}/transactions/${tx.hash}/token-transfers`).catch(() => ({ items: [] }))).items || [];
  let revenue = 0;
  for (const t of transfers) {
    const token = t.token || {};
    if (!(token.symbol || '').toUpperCase().includes('USD')) continue;
    const total = t.total || {};
    const dec = parseInt(total.decimals || token.decimals || '6', 10);
    revenue += parseInt(total.value || '0', 10) / 10 ** dec;
  }
  purchases.push({
    listingId: listingId ? parseInt(listingId.value, 10) : null,
    amount: amount ? parseInt(amount.value, 10) : 0,
    revenue,
  });
  await sleep(250);
}

const D = 1e6; // INAT credits use 6 decimals
const projects = cfg.projects.map((proj) => {
  const sales = purchases.filter((p) => p.listingId === proj.listing);
  return {
    ...proj,
    sales: sales.length,
    totalCredits: sales.reduce((s, x) => s + x.amount, 0) / D,
    revenue: sales.reduce((s, x) => s + x.revenue, 0),
    live: true,
  };
});

const out = {
  projects,
  totalPurchases: purchases.length,
  totalCreditsSold: purchases.reduce((s, x) => s + x.amount, 0) / D,
  totalListings: allTxs.filter((t) => ok(t) && sel(t) === SEL.createListing).length,
  cancelledListings: allTxs.filter((t) => ok(t) && sel(t) === SEL.cancelListing).length,
  totalRevenue: purchases.reduce((s, x) => s + x.revenue, 0),
  carbonBatchTxs: Array.isArray(carbonTxs.result) ? carbonTxs.result.length : 0,
  fetchedAt: new Date().toISOString(),
};
writeFileSync(path.join(root, 'dashboard/data/inat.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`INAT snapshot: ${out.totalPurchases} purchases, ${out.totalCreditsSold} credits, $${out.totalRevenue.toFixed(2)}`);
