#!/usr/bin/env node
// Builds dashboard/data/silvi.json from the Silvi Public API: status, area, map position and
// recorded trees, GPS photo logs (map points), seed beds / potted beds per project.
// Docs: https://api.silvi.earth/public-api/docs/
//
// Silvi issues one API key per project. Put them in gen/.env (gitignored), one per line:
//   SILVI_KEY_<ANY_LABEL>=silvi_...
// Usage: node scripts/fetch-silvi.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://api.silvi.earth/public-api';

// --- keys from the environment or gen/.env ---
const keys = {};
for (const [k, v] of Object.entries(process.env)) if (k.startsWith('SILVI_KEY_') && v) keys[k.slice(10)] = v;
const envFile = path.join(root, '.env');
if (existsSync(envFile)) {
  for (const m of readFileSync(envFile, 'utf8').matchAll(/^SILVI_KEY_(\w+)=(.+)$/gm)) {
    keys[m[1]] ??= m[2].trim().replace(/^["']|["']$/g, '');
  }
}
if (!Object.keys(keys).length) {
  console.error('No SILVI_KEY_* found (environment or gen/.env).');
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(key, p, params = {}) {
  const url = new URL(BASE + p);
  url.searchParams.set('key', key);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  for (let i = 0; i < 4; i++) {
    const res = await fetch(url);
    if (res.ok) return res.json();
    if (res.status === 429 || res.status >= 500) { await sleep(1500 * (i + 1)); continue; }
    throw new Error(`${res.status} ${p}`);
  }
  throw new Error(`gave up: ${p}`);
}
const count = async (key, p) => {
  try { const r = await get(key, p, { page_size: 1 }); return typeof r.count === 'number' ? r.count : null; }
  catch { return null; }
};

// Bounding-box centre of a GeoJSON geometry (good enough for a map marker)
function bbox(geometry) {
  const pts = [];
  (function walk(c) { if (typeof c[0] === 'number') pts.push(c); else c.forEach(walk); })(geometry.coordinates);
  if (!pts.length) return null;
  const lngs = pts.map((p) => p[0]); const lats = pts.map((p) => p[1]);
  return { minLng: Math.min(...lngs), maxLng: Math.max(...lngs), minLat: Math.min(...lats), maxLat: Math.max(...lats) };
}

const out = [];
for (const [label, key] of Object.entries(keys)) {
  const root_ = await get(key, '/');
  const p = root_.project;
  if (!p) { console.warn(`  ${label}: key is not project-scoped, skipped`); continue; }
  const id = p.id;
  const entry = {
    id, title: p.title, status: p.status, website: p.website_url || null,
    areaHa: null, zones: p.mrv_stats ? p.mrv_stats.zone_count : null, lat: null, lng: null,
    trees: null, logs: null, seedBeds: null, pottedBeds: null,
  };

  try {
    const gis = await get(key, `/projects/${id}/gis/`);
    const zones = (gis.zones || []).map((z) => ({
      ...z, geometry: typeof z.geometry === 'string' ? JSON.parse(z.geometry) : z.geometry,
    }));
    // Project area = sum of its boundary zones ("site" zones lie inside a boundary, so they would double count)
    const boundaries = zones.filter((z) => z.zone_type === 'boundary');
    const areaZones = boundaries.length ? boundaries : zones;
    entry.areaHa = Math.round(areaZones.reduce((s, z) => s + (z.area_in_ha || 0), 0) * 100) / 100;
    const biggest = [...areaZones].sort((a, b) => (b.area_in_ha || 0) - (a.area_in_ha || 0))[0];
    const b = biggest && biggest.geometry && bbox(biggest.geometry);
    if (b) { entry.lat = +((b.minLat + b.maxLat) / 2).toFixed(5); entry.lng = +((b.minLng + b.maxLng) / 2).toFixed(5); }
  } catch (e) { console.warn(`  ${label}: gis: ${e.message}`); }

  entry.trees = await count(key, `/projects/${id}/trees/`);
  // Most projects record their plantings as GPS-tagged photo logs (the points on the Silvi map),
  // not as individual tree records, so /trees/ stays empty. Count the logs as well.
  entry.logs = await count(key, `/projects/${id}/logs/`);
  entry.seedBeds = await count(key, `/projects/${id}/seed-beds/`);
  entry.pottedBeds = await count(key, `/projects/${id}/potted-beds/`);

  out.push(entry);
  console.log(`  #${id} ${entry.title}: ${entry.areaHa} ha, trees ${entry.trees}, logs ${entry.logs}, seed beds ${entry.seedBeds}, potted beds ${entry.pottedBeds}, ${entry.lat ? entry.lat + ', ' + entry.lng : 'no position'}`);
}

out.sort((a, b) => a.id - b.id);
writeFileSync(path.join(root, 'dashboard/data/silvi.json'),
  JSON.stringify({ projects: out, fetchedAt: new Date().toISOString() }, null, 2) + '\n');
console.log(`Wrote ${out.length} projects to dashboard/data/silvi.json`);
