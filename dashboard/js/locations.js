// ============================================================
// GEN Ukraine Impact Dashboard — Locations and hromadas
// ============================================================
// data/locations.json   one row per place with its IDs on every platform (hand-curated registry)
// data/hromadas.geojson hromadas we touch + hromadas with eco goals (scripts/build-hromadas.py)
// Platform numbers come from the same snapshots as the other blocks, so a card always matches them.

const LOCATIONS = { reg: null, geo: null, data: null, filter: 'all', showAllHromadas: false, showAllCards: false };
const LOC_CARDS_FIRST = 12;

const LOC_SOURCES = {
  silvi:       { label: 'Silvi',       badge: 'badge-regen' },
  arkreen:     { label: 'Arkreen',     badge: 'badge-arkreen' },
  sarafu:      { label: 'Sarafu',      badge: 'badge-sarafu' },
  inat:        { label: 'INAT',        badge: 'badge-gainforest' },
  solar:       { label: 'Solar',       badge: 'badge-arkreen' },
  rainwater:   { label: 'Water',       badge: 'badge-birdweather' },
  birdweather: { label: 'BirdWeather', badge: 'badge-birdweather' },
};

const LOC_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'trees', label: 'Trees', test: s => s.trees > 0 },
  { key: 'energy', label: 'Solar energy', test: s => s.kwh > 0 || s.solar.length > 0 },
  { key: 'economy', label: 'Local economy', test: s => s.reports > 0 },
  { key: 'credits', label: 'Eco-credits', test: s => s.credits > 0 },
  { key: 'water', label: 'Water', test: s => s.rain.length > 0 },
  { key: 'birds', label: 'Birds', test: s => s.birdIds.length > 0 },
];

const fmtN = (n, d = 0) => Number(n).toLocaleString(LOCALE, { maximumFractionDigits: d });
const locName = l => (LANG === 'uk' ? l.name : l.nameEn || l.name);

async function loadLocationFiles() {
  const get = u => fetchWithTimeout(u, 10000).then(r => (r.ok ? r.json() : null)).catch(() => null);
  const [reg, geo] = await Promise.all([get('data/locations.json'), get('data/hromadas.geojson')]);
  LOCATIONS.reg = reg;
  LOCATIONS.geo = geo;
  return !!reg;
}

// All numbers for one location, read from the merged dashboard data
function locationStats(loc, data) {
  const L = loc.links || {};
  const s = { trees: 0, ha: 0, kwh: 0, akre: 0, reports: 0, credits: 0, usd: 0, solar: [], rain: [], birdIds: L.birdweather || [], birds: null, urls: [] };

  (L.silvi || []).forEach(id => {
    const p = (data.silviProjects || []).find(x => x.id === id);
    if (!p) return;
    s.trees += p.trees || 0;
    s.ha += p.hectares || 0;
    s.urls.push({ src: 'silvi', label: p.name, url: `https://app.silvi.earth/?asset=zone&sourceProject=${p.id}&sourceProjectTitle=${encodeURIComponent(p.name)}` });
  });
  (L.arkreen || []).forEach(id => {
    const n = ((data.energy && data.energy.nodes) || []).find(x => x.id === id);
    if (!n) return;
    s.kwh += n.kwh || 0;
    s.akre += n.tokens || 0;
    if (n.explorerUrl) s.urls.push({ src: 'arkreen', label: n.name, url: n.explorerUrl });
  });
  (L.sarafu || []).forEach(name => {
    const v = ((data.sarafuReports && data.sarafuReports.settlements) || []).find(x => x.name === name);
    if (!v) return;
    s.reports += v.reports || 0;
    s.urls.push({ src: 'sarafu', label: name, url: v.url });
  });
  (L.inat || []).forEach(name => {
    const p = ((data.inat && data.inat.projects) || []).find(x => x.name === name);
    if (!p) return;
    s.credits += p.totalCredits || 0;
    s.usd += p.revenue || 0;
    s.urls.push({ src: 'inat', label: name, url: p.url });
  });
  (L.solar || []).forEach(name => {
    const x = (data.solarStations || []).find(v => v.name === name);
    if (x) s.solar.push(x.desc);
  });
  (L.rainwater || []).forEach(name => {
    const x = (data.rainwaterSystems || []).find(v => v.name === name);
    if (x) s.rain.push(x.desc);
  });
  const stations = (data.birds && data.birds.stations) || [];
  s.birdIds.forEach(id => {
    const st = stations.find(x => x.id === id);
    s.urls.push({ src: 'birdweather', label: st ? st.name : `#${id}`, url: `https://app.birdweather.com/stations/${id}` });
    if (!st) return;
    s.birds = s.birds || { detections: 0, species: 0 };
    s.birds.detections += st.detections || 0;
    s.birds.species = Math.max(s.birds.species, st.speciesCount || 0);
  });
  s.sources = Object.keys(L).filter(k => k !== 'pomistya' && (L[k] || []).length);
  return s;
}

function hromadaProps(code) {
  const f = LOCATIONS.geo && LOCATIONS.geo.features.find(x => x.properties.code === code);
  return f ? f.properties : null;
}

function hromadaLabel(p) {
  return LANG === 'uk' ? `${p.name} громада` : `${p.name} hromada`;
}

function oblastLabel(p) {
  return LANG === 'uk' ? `${p.oblast} обл.` : `${p.oblast} oblast`;
}

function metricRows(s) {
  const rows = [];
  if (s.trees || s.ha) rows.push(['🌳', [s.trees ? T('{n} trees', { n: fmtN(s.trees) }) : '', s.ha ? `${fmtN(s.ha, 2)} ${T('ha')}` : ''].filter(Boolean).join(' · ')]);
  if (s.kwh || s.akre) rows.push(['☀️', `${fmtN(s.kwh)} ${T('kWh')} · ${fmtN(s.akre)} AKRE`]);
  s.solar.forEach(d => rows.push(['🔆', T(d)]));
  s.rain.forEach(d => rows.push(['💧', T(d)]));
  if (s.reports) rows.push(['🤝', T('{n} reports', { n: s.reports })]);
  if (s.credits) rows.push(['💳', `${T('{n} credits', { n: s.credits })} · $${fmtN(s.usd, 2)}`]);
  if (s.birds) rows.push(['🐦', `${T('{n} detections', { n: fmtN(s.birds.detections) })} · ${T('{n} species', { n: s.birds.species })}`]);
  return rows;
}

function renderLocationCards() {
  const wrap = document.getElementById('loc-cards');
  if (!wrap || !LOCATIONS.reg) return;
  const data = LOCATIONS.data;
  const f = LOC_FILTERS.find(x => x.key === LOCATIONS.filter) || LOC_FILTERS[0];
  const items = LOCATIONS.reg.locations
    .map(l => ({ l, s: locationStats(l, data) }))
    .filter(({ s }) => !f.test || f.test(s))
    .sort((a, b) => b.s.sources.length - a.s.sources.length || (a.l.lat == null) - (b.l.lat == null) || locName(a.l).localeCompare(locName(b.l), LOCALE));

  const total = items.length;
  const cut = !LOCATIONS.showAllCards && total > LOC_CARDS_FIRST + 3;
  wrap.innerHTML = (cut ? items.slice(0, LOC_CARDS_FIRST) : items).map(({ l, s }) => {
    const h = l.hromada && hromadaProps(l.hromada);
    const where = h ? `<button type="button" class="loc-hromada" data-hromada="${h.code}">${esc(hromadaLabel(h))}</button> · ${esc(oblastLabel(h))}`
      : l.lat == null ? `<span class="text-gray-600">${T('no coordinates yet')}</span>`
      : `<span class="text-gray-600">${T('outside hromada boundaries')}</span>`;
    const badges = s.sources.map(k => `<span class="card-badge ${LOC_SOURCES[k].badge}">${T(LOC_SOURCES[k].label)}</span>`).join('');
    const rows = metricRows(s);
    const links = s.urls.map(u => `<a href="${u.url}" target="_blank" rel="noopener" title="${esc(u.label)}">${esc(LOC_SOURCES[u.src].label)}: ${esc(u.label)} →</a>`).join('');
    const unsure = (l.unsure || []).map(t => `<p class="loc-unsure">⚠ ${esc(T(t))}</p>`).join('');
    return `
      <div class="loc-card">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <p class="loc-name">${esc(locName(l))}</p>
            <p class="loc-sub">${where}</p>
          </div>
          ${l.lat != null ? `<button type="button" class="loc-pin" data-loc="${l.id}" title="${T('Show on map')}" aria-label="${T('Show on map')}">📍</button>` : ''}
        </div>
        <div class="flex flex-wrap gap-1 mt-2">${badges}</div>
        ${rows.length ? `<div class="loc-metrics">${rows.map(([i, t]) => `<div><span>${i}</span><span>${t}</span></div>`).join('')}</div>` : `<p class="loc-empty">${T('Listed on a platform; no numbers yet')}</p>`}
        ${links ? `<div class="loc-links">${links}</div>` : ''}
        ${unsure}
      </div>`;
  }).join('') || `<p class="text-xs text-gray-500">${T('Nothing matches this filter')}</p>`;
  const more = document.getElementById('loc-more');
  if (more) {
    more.classList.toggle('hidden', total <= LOC_CARDS_FIRST + 3);
    more.textContent = LOCATIONS.showAllCards ? T('Show fewer') : T('Show all {n} places', { n: total });
    more.onclick = () => { LOCATIONS.showAllCards = !LOCATIONS.showAllCards; renderLocationCards(); };
  }
}

function renderLocationFilters() {
  const el = document.getElementById('loc-filters');
  if (!el) return;
  const data = LOCATIONS.data;
  const stats = LOCATIONS.reg.locations.map(l => locationStats(l, data));
  el.innerHTML = LOC_FILTERS.map(f => {
    const n = f.test ? stats.filter(f.test).length : stats.length;
    return `<button type="button" class="loc-chip${f.key === LOCATIONS.filter ? ' loc-chip-on' : ''}" data-filter="${f.key}">${T(f.label)} <span>${n}</span></button>`;
  }).join('');
  el.onclick = e => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    LOCATIONS.filter = b.dataset.filter;
    renderLocationFilters();
    renderLocationCards();
  };
}

function renderLocationSummary() {
  const el = document.getElementById('loc-summary');
  if (!el) return;
  const data = LOCATIONS.data;
  const locs = LOCATIONS.reg.locations;
  const stats = locs.map(l => locationStats(l, data));
  const multi = stats.filter(s => s.sources.length >= 2).length;
  const hromadas = new Set(locs.map(l => l.hromada).filter(Boolean)).size;
  const noCoords = locs.filter(l => l.lat == null).length;
  const unsure = locs.filter(l => (l.unsure || []).length).length;
  const box = (v, label, tip) => `<div class="metric-box metric-box-sm"><p class="metric-value">${v}</p><p class="metric-label">${label}${tip ? ` <span class="hint" tabindex="0" role="button" aria-label="${T('What is this?')}" data-tip="${esc(tip)}">i</span>` : ''}</p></div>`;
  el.innerHTML =
    box(locs.length, T('Places in the registry'), T('Every place that appears on at least one platform or on the network maps, merged by name and position.')) +
    box(multi, T('Seen on 2+ platforms'), T('Places whose data could be joined across platforms, for example Silvi trees and Sarafu reports for the same ecovillage.')) +
    box(hromadas, T('Hromadas'), T('Territorial communities (municipalities) the places with coordinates fall into.')) +
    box(`${noCoords} / ${unsure}`, T('No coordinates / to confirm'), T('Places with no position yet, and matches made only by a similar name or a nearby point.'));
}

// --- Hromada table ---
function hromadaStats(data) {
  const byCode = {};
  LOCATIONS.reg.locations.forEach(l => {
    if (!l.hromada) return;
    const s = locationStats(l, data);
    const h = (byCode[l.hromada] = byCode[l.hromada] || { places: [], trees: 0, kwh: 0, reports: 0, usd: 0, credits: 0 });
    h.places.push(l);
    h.trees += s.trees; h.kwh += s.kwh; h.reports += s.reports; h.usd += s.usd; h.credits += s.credits;
  });
  return byCode;
}

function renderHromadaTable() {
  const el = document.getElementById('hromada-table');
  if (!el || !LOCATIONS.geo) return;
  const stats = hromadaStats(LOCATIONS.data);
  const feats = LOCATIONS.geo.features.map(f => f.properties).filter(p => p.locations.length || p.ecovillages.length);
  const withData = feats.filter(p => stats[p.code]);
  const rest = feats.filter(p => !stats[p.code]);
  const shown = LOCATIONS.showAllHromadas ? withData.concat(rest) : withData;
  shown.sort((a, b) => {
    const A = stats[a.code], B = stats[b.code];
    return (B ? B.places.length : 0) - (A ? A.places.length : 0) || b.ecovillages.length - a.ecovillages.length || a.name.localeCompare(b.name, 'uk');
  });
  const num = (v, d = 0) => (v ? fmtN(v, d) : '<span class="text-gray-700">—</span>');
  el.innerHTML = `
    <div class="overflow-x-auto">
      <table class="hromada-table">
        <thead><tr>
          <th>${T('Hromada')}</th><th>${T('Population')}</th><th>${T('Ecovillages')}</th><th>${T('Our places')}</th>
          <th>🌳 ${T('Trees')}</th><th>☀️ ${T('kWh')}</th><th>🤝 ${T('Reports')}</th><th>💳 ${T('Credits, $')}</th>
        </tr></thead>
        <tbody>${shown.map(p => {
          const s = stats[p.code] || { places: [], trees: 0, kwh: 0, reports: 0, usd: 0 };
          const goal = p.ecoGoal ? `<span class="hromada-goal-dot" style="background:${LOCATIONS.geo.categories[p.ecoGoal.category].color}" title="${esc(T('Has an eco goal in its strategy'))}"></span>` : '';
          return `<tr>
            <td><button type="button" class="loc-hromada" data-hromada="${p.code}">${esc(p.name)}</button>${goal}<div class="text-gray-500 text-[0.65rem]">${esc(oblastLabel(p))}</div></td>
            <td>${p.population ? fmtN(p.population) : '—'}</td>
            <td>${num(p.ecovillages.length)}</td>
            <td class="hromada-places">${s.places.map(l => esc(locName(l))).join(', ') || '<span class="text-gray-700">—</span>'}</td>
            <td>${num(s.trees)}</td><td>${num(s.kwh)}</td><td>${num(s.reports)}</td><td>${s.usd ? '$' + fmtN(s.usd, 0) : num(0)}</td>
          </tr>`;
        }).join('')}</tbody>
      </table>
    </div>
    ${rest.length ? `<button type="button" class="loc-more" id="hromada-more">${LOCATIONS.showAllHromadas
      ? T('Show only hromadas with platform data')
      : T('Show {n} more hromadas with ecovillages from the community map', { n: rest.length })}</button>` : ''}`;
  const more = document.getElementById('hromada-more');
  if (more) more.onclick = () => { LOCATIONS.showAllHromadas = !LOCATIONS.showAllHromadas; renderHromadaTable(); };
}

function renderHromadaGoals() {
  const el = document.getElementById('hromada-goals');
  if (!el || !LOCATIONS.geo) return;
  const cats = LOCATIONS.geo.categories;
  const goals = LOCATIONS.geo.features.map(f => f.properties).filter(p => p.ecoGoal);
  el.innerHTML = Object.entries(cats).map(([key, c]) => {
    const list = goals.filter(p => p.ecoGoal.category === key);
    return `<div>
      <p class="col-title mb-2"><span class="col-dot" style="background:${c.color}"></span>${esc(LANG === 'uk' ? c.uk : c.en)} <span class="text-gray-500 font-normal ml-1">${list.length}</span></p>
      <div class="space-y-2">${list.map(p => `
        <div class="goal-item">
          <button type="button" class="loc-hromada" data-hromada="${p.code}">${esc(p.name)}</button>
          <span class="text-gray-500"> · ${esc(oblastLabel(p))}</span>
          ${p.ecovillages.length ? `<span class="goal-ours">${T('{n} ecovillages', { n: p.ecovillages.length })} ${T('already here')}</span>` : ''}
          <p>${esc(LANG === 'uk' ? p.ecoGoal.uk : p.ecoGoal.en)}</p>
        </div>`).join('')}</div>
    </div>`;
  }).join('');
}

// --- Map: hromada shapes (layer groups are created by map.js) ---
function hromadaPopup(p) {
  const s = hromadaStats(LOCATIONS.data)[p.code];
  const cat = p.ecoGoal && LOCATIONS.geo.categories[p.ecoGoal.category];
  const line = (t) => `<div style="margin-top:3px;color:#d1d5db;font-size:0.75rem;">${t}</div>`;
  let html = `<div><strong style="color:#e5e7eb;font-size:0.9rem;">${esc(hromadaLabel(p))}</strong>`;
  html += `<div style="color:#9ca3af;font-size:0.72rem;">${esc(oblastLabel(p))}${p.population ? ' · ' + T('{n} people', { n: fmtN(p.population) }) : ''}</div>`;
  if (s) {
    html += line(`<b>${T('Our places')}:</b> ${s.places.map(l => esc(locName(l))).join(', ')}`);
    const m = [s.trees ? T('{n} trees', { n: fmtN(s.trees) }) : '', s.kwh ? `${fmtN(s.kwh)} ${T('kWh')}` : '', s.reports ? T('{n} reports', { n: s.reports }) : '', s.usd ? `$${fmtN(s.usd, 0)} ${T('credits')}` : ''].filter(Boolean);
    if (m.length) html += line(m.join(' · '));
  }
  if (p.ecovillages.length) html += line(`<b>${T('Ecovillages')}:</b> ${p.ecovillages.map(n => esc(T(n))).join(', ')}`);
  if (cat) html += `<div style="margin-top:6px;padding-top:5px;border-top:1px solid rgba(255,255,255,0.1);font-size:0.75rem;"><span style="color:${cat.color};font-weight:600;">${esc(LANG === 'uk' ? cat.uk : cat.en)}</span><div style="color:#d1d5db;">${esc(LANG === 'uk' ? p.ecoGoal.uk : p.ecoGoal.en)}</div></div>`;
  return html + '</div>';
}

function drawHromadaLayers() {
  const layers = window.hromadaLayers;
  if (!layers || !LOCATIONS.geo || typeof L === 'undefined') return;
  layers.ours.clearLayers();
  layers.goals.clearLayers();
  LOCATIONS.shapes = {};
  const cats = LOCATIONS.geo.categories;
  LOCATIONS.geo.features.forEach(f => {
    const p = f.properties;
    const ours = p.locations.length || p.ecovillages.length;
    const cat = p.ecoGoal && cats[p.ecoGoal.category];
    const style = cat
      ? { color: cat.color, weight: 1.5, fillColor: cat.color, fillOpacity: 0.28, dashArray: ours ? null : '4 3' }
      : { color: '#2dd4bf', weight: 1, fillColor: '#2dd4bf', fillOpacity: p.locations.length ? 0.14 : 0.06 };
    const shape = L.geoJSON(f, { style }).bindPopup(() => hromadaPopup(p), { maxWidth: 280 });
    shape.addTo(cat ? layers.goals : layers.ours);
    LOCATIONS.shapes[p.code] = shape;
  });
  const legend = document.getElementById('hromada-cats');
  if (legend) {
    legend.innerHTML = Object.values(cats).map(c =>
      `<div class="map-legend-row"><span style="width:13px;display:inline-flex;justify-content:center;"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${c.color};opacity:0.7;"></span></span><span>${esc(LANG === 'uk' ? c.uk : c.en)}</span></div>`
    ).join('');
  }
}

function focusOnMap(latlngOrBounds, popupHtml, layer) {
  const map = window.dashboardMap;
  const block = document.getElementById('block-map');
  if (!map || !block) return;
  block.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => {
    if (latlngOrBounds.getNorthEast) map.flyToBounds(latlngOrBounds, { maxZoom: 9, duration: 0.8 });
    else map.flyTo(latlngOrBounds, 10, { duration: 0.8 });
    map.once('moveend', () => {
      if (layer) {
        if (!map.hasLayer(layer)) layer.addTo(map);
        layer.openPopup(latlngOrBounds.getCenter ? latlngOrBounds.getCenter() : latlngOrBounds);
      } else if (popupHtml) L.popup().setLatLng(latlngOrBounds).setContent(popupHtml).openOn(map);
    });
  }, 350);
}

function locationPopup(l) {
  const s = locationStats(l, LOCATIONS.data);
  const h = l.hromada && hromadaProps(l.hromada);
  return `<div><strong style="color:#a7f3d0;font-size:0.9rem;">${esc(locName(l))}</strong>
    ${h ? `<div style="color:#9ca3af;font-size:0.72rem;">${esc(hromadaLabel(h))} · ${esc(oblastLabel(h))}</div>` : ''}
    ${metricRows(s).map(([i, t]) => `<div style="margin-top:3px;color:#d1d5db;font-size:0.75rem;">${i} ${t}</div>`).join('')}</div>`;
}

function wireLocationClicks() {
  document.addEventListener('click', e => {
    const pin = e.target.closest('[data-loc]');
    if (pin) {
      const l = LOCATIONS.reg.locations.find(x => x.id === pin.dataset.loc);
      if (l && l.lat != null) focusOnMap(L.latLng(l.lat, l.lng), locationPopup(l));
      return;
    }
    const hb = e.target.closest('[data-hromada]');
    if (hb && LOCATIONS.shapes && LOCATIONS.shapes[hb.dataset.hromada]) {
      const shape = LOCATIONS.shapes[hb.dataset.hromada];
      const parent = window.hromadaLayers && (window.hromadaLayers.goals.hasLayer(shape) ? window.hromadaLayers.goals : window.hromadaLayers.ours);
      const map = window.dashboardMap;
      if (map && parent && !map.hasLayer(parent)) {
        parent.addTo(map);
        const cb = document.getElementById(parent === window.hromadaLayers.goals ? 'layer-eco-goal-hromadas' : 'layer-our-hromadas');
        if (cb) cb.checked = true;
      }
      focusOnMap(shape.getBounds(), null, shape);
    }
  });
}

// Called with mock data on first paint, then again once live data has merged
async function renderLocations(data) {
  LOCATIONS.data = data;
  if (!LOCATIONS.reg) {
    const ok = await loadLocationFiles();
    if (!ok) { const b = document.getElementById('block-locations'); if (b) b.classList.add('hidden'); return; }
    wireLocationClicks();
  }
  renderLocationSummary();
  renderLocationFilters();
  renderLocationCards();
  renderHromadaTable();
  renderHromadaGoals();
  drawHromadaLayers();
}
