// ============================================================
// GEN Ukraine Impact Dashboard — Locations and hromadas
// ============================================================
// data/locations.json   one row per place with its IDs on every platform (hand-curated registry)
// data/hromadas.geojson hromadas we touch + hromadas with eco goals (scripts/build-hromadas.py)
// Platform numbers come from the same snapshots as the other blocks, so a card always matches them.

const LOCATIONS = { reg: null, geo: null, data: null, filter: 'all', showAllCards: false };
const LOC_CARDS_FIRST = 12;

const LOC_SOURCES = {
  silvi:       { label: 'Silvi',       badge: 'badge-regen' },
  arkreen:     { label: 'Arkreen',     badge: 'badge-arkreen' },
  sarafu:      { label: 'Sarafu',      badge: 'badge-sarafu' },
  inat:        { label: 'INAT',        badge: 'badge-gainforest' },
  solar:       { label: 'Solar',       badge: 'badge-arkreen' },
  rainwater:   { label: 'Water',       badge: 'badge-birdweather' },
  birdweather: { label: 'BirdWeather', badge: 'badge-birdweather' },
  pomistya:    { label: 'pomistya.club', badge: 'badge-regen' },
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

// One name per place everywhere on the page: a platform item linked in the registry shows the
// registry name; its own title stays as a small second line only when the place has several such items.
function placeName(src, key, original) {
  const reg = LOCATIONS.reg;
  const l = reg && key != null && reg.locations.find(x => ((x.links || {})[src] || []).includes(key));
  if (!l) return { name: original, sub: '' };
  return { name: locName(l), sub: (l.links[src] || []).length > 1 ? original : '', id: l.id };
}
function placeNameHtml(src, key, original) {
  const n = placeName(src, key, original);
  return esc(n.name) + (n.sub ? ` <span class="text-gray-500">· ${esc(n.sub)}</span>` : '');
}

async function loadLocationFiles() {
  const get = u => fetchWithTimeout(u, 10000).then(r => (r.ok ? r.json() : null)).catch(() => null);
  const [reg, geo, pom] = await Promise.all([get('data/locations.json'), get('data/hromadas.geojson'), get('data/pomistya.json')]);
  LOCATIONS.reg = reg;
  LOCATIONS.geo = geo;
  // Community map table (pomistya.club): replaces the static ecovillage list in data.js
  if (pom && Array.isArray(pom.settlements)) {
    LOCATIONS.pom = pom.settlements;
    if (typeof MOCK_DATA !== 'undefined') MOCK_DATA.ecovillages = pom.settlements;
  }
  return !!reg;
}

// All numbers for one location, read from the merged dashboard data
function locationStats(loc, data) {
  const L = loc.links || {};
  const s = { trees: 0, ha: 0, kwh: 0, akre: 0, reports: 0, credits: 0, usd: 0, solar: [], rain: [], birdIds: L.birdweather || [], birds: null, urls: [], buy: [] };

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
    if (p.listing != null) s.buy.push({ listing: p.listing, name: p.name, url: p.url });
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
  s.pom = (L.pomistya || []).map(pomById).filter(Boolean);
  s.pom.forEach(p => s.urls.push({ src: 'pomistya', label: p.name, url: pomUrl(p) }));
  s.sources = Object.keys(L).filter(k => k !== 'pomistya' && (L[k] || []).length);
  return s;
}

const pomById = id => (LOCATIONS.pom || []).find(p => p.id === id);
const pomByName = name => (LOCATIONS.pom || []).find(p => p.name === name);
const pomUrl = p => `https://pomistya.club/map/${p.id}/`;

// "15 plots taken · 9 families winter here · 4 children" from the community map table
function pomFacts(p) {
  const f = [];
  if (p.plotsTaken) f.push(T('{n} plots taken', { n: p.plotsTaken }));
  if (p.plotsFree) f.push(T('{n} free', { n: p.plotsFree }));
  if (p.winteringFamilies) f.push(T('{n} families all year', { n: p.winteringFamilies }));
  if (p.children) f.push(T('{n} children', { n: p.children }));
  return f.join(' · ');
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
  s.pom.forEach(p => { const f = pomFacts(p); if (f) rows.push(['🏡', f]); });
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
    const where = h ? `${esc(hromadaLabel(h))} · ${esc(oblastLabel(h))}`
      : l.lat == null ? `<span class="text-gray-600">${T('no coordinates yet')}</span>`
      : `<span class="text-gray-600">${T('outside hromada boundaries')}</span>`;
    const badges = s.sources.map(k => `<span class="card-badge ${LOC_SOURCES[k].badge}">${T(LOC_SOURCES[k].label)}</span>`).join('');
    const rows = metricRows(s).filter(([i]) => !(i === '🏡' && s.pom.length)); // community facts get their own section
    const unsure = (l.unsure || []).length ? `<span class="loc-unsure-mark" title="${esc(T('Match to confirm'))}">⚠</span>` : '';
    const shown = rows.filter(([i]) => i !== '🔆' && i !== '💧').slice(0, 3);
    return `
      <button type="button" class="loc-card" data-open-loc="${l.id}" aria-label="${esc(T('Open {name}', { name: locName(l) }))}">
        <p class="loc-name">${esc(locName(l))} ${unsure}</p>
        <p class="loc-sub">${where}</p>
        <div class="flex flex-wrap gap-1 mt-2">${badges}</div>
        ${shown.length ? `<div class="loc-metrics">${shown.map(([i, t]) => `<div><span>${i}</span><span>${t}</span></div>`).join('')}</div>` : `<p class="loc-empty">${T('Listed on a platform; no numbers yet')}</p>`}
        <span class="loc-open">${T('Details')} →</span>
      </button>`;
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

// --- Hromada facts (used in the place detail) ---
function hromadaStats(data) {
  const byCode = {};
  LOCATIONS.reg.locations.forEach(l => {
    if (!l.hromada) return;
    (byCode[l.hromada] = byCode[l.hromada] || []).push(l);
  });
  return byCode;
}


// --- Dashboard map: one pin per place; a click fills the side panel ---
let pinSelected = null;

function pinPanelEmpty() {
  const el = document.getElementById('pin-panel');
  if (!el || !LOCATIONS.reg) return;
  const placed = LOCATIONS.reg.locations.filter(l => l.lat != null).length;
  el.innerHTML = `<p class="pin-hint">${T('Click a pin on the map to see what the network knows about that place.')}</p>
    <p class="pin-hint-sub">${T('{n} places on the map', { n: placed })}</p>`;
}

function showPinPanel(l) {
  const el = document.getElementById('pin-panel');
  if (!el) return;
  const s = locationStats(l, LOCATIONS.data);
  const h = l.hromada && hromadaProps(l.hromada);
  const rows = metricRows(s).filter(([i]) => !(i === '🏡' && s.pom.length)); // community facts get their own section
  const pom = s.pom.map(p => `<div class="loc-d-row"><span>🏡</span><span><b>${esc(p.name)}</b>${p.type ? ' · ' + esc(p.type) : ''}</span></div>`).join('');
  el.innerHTML = `
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0">
        <h3 class="loc-d-name">${esc(locName(l))}</h3>
        ${h ? `<p class="loc-sub">${esc(hromadaLabel(h))} · ${esc(oblastLabel(h))}</p>` : ''}
      </div>
      <button type="button" class="loc-d-close" data-close-pin aria-label="${T('Close')}">✕</button>
    </div>
    <div class="flex flex-wrap gap-1 mt-2">${s.sources.map(k => `<span class="card-badge ${LOC_SOURCES[k].badge}">${T(LOC_SOURCES[k].label)}</span>`).join('')}</div>
    <div class="loc-d-sec"><p class="loc-d-title">${T('What is measured here')}</p>
      ${rows.length ? rows.map(([i, t]) => `<div class="loc-d-row"><span>${i}</span><span>${t}</span></div>`).join('') : `<p class="loc-empty">${T('Listed on a platform; no numbers yet')}</p>`}</div>
    ${pom ? `<div class="loc-d-sec"><p class="loc-d-title">${T('Community map')}</p>${pom}</div>` : ''}
    <button type="button" class="pin-open" data-open-loc="${l.id}">${T('Full card with map and sources')} →</button>`;
  el.classList.add('pin-panel-on');
  if (window.matchMedia('(max-width: 767px)').matches) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function selectPin(id) {
  pinSelected = id;
  document.querySelectorAll('#map .loc-dot').forEach(d => d.classList.toggle('loc-dot-sel', d.dataset.loc === id));
  const l = id && LOCATIONS.reg.locations.find(x => x.id === id);
  if (l) showPinPanel(l);
  else { const el = document.getElementById('pin-panel'); if (el) el.classList.remove('pin-panel-on'); pinPanelEmpty(); }
}

window.drawPins = function () {
  const layer = window.pinLayer;
  if (!layer || !LOCATIONS.reg || typeof L === 'undefined') return;
  layer.clearLayers();
  LOCATIONS.reg.locations.forEach(l => {
    if (l.lat == null) return;
    const n = locationStats(l, LOCATIONS.data).sources.length;
    const size = 10 + Math.min(n, 5) * 2;
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div class="loc-dot${l.id === pinSelected ? ' loc-dot-sel' : ''}" data-loc="${l.id}" style="width:${size}px;height:${size}px;"></div>`,
      iconSize: [size, size], iconAnchor: [size / 2, size / 2],
    });
    L.marker([l.lat, l.lng], { icon, title: locName(l) }).on('click', () => selectPin(l.id)).addTo(layer);
  });
  if (pinSelected) selectPin(pinSelected); else pinPanelEmpty();
};

// --- Places tab: hromada list, from the most complete to the ones proposed for growth ---
LOCATIONS.hromadaPage = {};
const HROMADA_PAGE = 8;

function hromadaRow(p, places) {
  const cats = LOCATIONS.geo.categories;
  const cat = p.ecoGoal && cats[p.ecoGoal.category];
  const sources = new Set();
  const sum = { trees: 0, kwh: 0, reports: 0, usd: 0 };
  places.forEach(l => {
    const s = locationStats(l, LOCATIONS.data);
    s.sources.forEach(k => sources.add(k));
    sum.trees += s.trees || 0; sum.kwh += s.kwh || 0; sum.reports += s.reports || 0; sum.usd += s.usd || 0;
  });
  const m = [sum.trees ? T('{n} trees', { n: fmtN(sum.trees) }) : '', sum.kwh ? `${fmtN(sum.kwh)} ${T('kWh')}` : '', sum.reports ? T('{n} reports', { n: sum.reports }) : '', sum.usd ? `$${fmtN(sum.usd, 0)} ${T('credits')}` : ''].filter(Boolean);
  const pom = p.ecovillages.map(pomByName).filter(Boolean);
  const psum = k => pom.reduce((a, x) => a + (x[k] || 0), 0);
  const facts = pom.length ? pomFacts({ plotsTaken: psum('plotsTaken'), winteringFamilies: psum('winteringFamilies'), children: psum('children') }) : '';
  return `<div class="hrom-row"${cat ? ` style="border-left-color:${cat.color}"` : ''}>
    <div class="hrom-head">
      <div class="min-w-0">
        <span class="hrom-name">${esc(hromadaLabel(p))}</span>
        <span class="loc-sub"> · ${esc(oblastLabel(p))}${p.population ? ' · ' + T('{n} people', { n: fmtN(p.population) }) : ''}</span>
      </div>
      ${sources.size ? `<div class="flex flex-wrap gap-1">${[...sources].map(k => `<span class="card-badge ${LOC_SOURCES[k].badge}">${T(LOC_SOURCES[k].label)}</span>`).join('')}</div>` : ''}
    </div>
    ${places.length ? `<div class="loc-d-row"><span>📍</span><span>${places.map(l => `<button type="button" class="loc-link" data-open-loc="${l.id}">${esc(locName(l))}</button>`).join(', ')}${m.length ? ' · ' + m.join(' · ') : ''}</span></div>` : ''}
    ${p.ecovillages.length ? `<div class="loc-d-row"><span>🏡</span><span>${p.ecovillages.map(esc).join(', ')}${facts ? ' · ' + facts : ''}</span></div>` : ''}
    ${cat ? `<div class="loc-d-row"><span>🎯</span><span><b style="color:${cat.color}">${esc(LANG === 'uk' ? cat.uk : cat.en)}</b>: ${esc(LANG === 'uk' ? p.ecoGoal.uk : p.ecoGoal.en)}</span></div>` : ''}
  </div>`;
}

function renderHromadaList() {
  const el = document.getElementById('hromada-list');
  if (!el || !LOCATIONS.geo) return;
  const byCode = hromadaStats(LOCATIONS.data);
  const rows = LOCATIONS.geo.features.map(f => {
    const p = f.properties;
    const places = byCode[p.code] || [];
    const sources = new Set(places.flatMap(l => locationStats(l, LOCATIONS.data).sources));
    return { p, places, score: sources.size * 10 + places.length * 3 + (p.ecoGoal ? 5 : 0) + p.ecovillages.length };
  }).filter(r => r.places.length || r.p.ecovillages.length);
  const byScore = (a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name, 'uk');
  // Growth candidates (eco goal, nothing of ours yet) have their own block: renderHromadaGoals
  const groups = [
    { key: 'ours', title: T('Where the network works'), desc: T('Our places with data on the platforms'), list: rows.filter(r => r.places.length).sort(byScore) },
    { key: 'eco', title: T('Ecovillages on the community map'), desc: T('No platform data yet'), list: rows.filter(r => !r.places.length && r.p.ecovillages.length).sort(byScore) },
  ];
  el.innerHTML = groups.filter(g => g.list.length).map(g => {
    const pages = Math.ceil(g.list.length / HROMADA_PAGE);
    const page = Math.min(LOCATIONS.hromadaPage[g.key] || 0, pages - 1);
    const shown = g.list.slice(page * HROMADA_PAGE, (page + 1) * HROMADA_PAGE);
    const dots = pages > 1 ? `<div class="pager">${Array.from({ length: pages }, (_, i) =>
      `<button type="button" class="pager-dot${i === page ? ' pager-dot-on' : ''}" data-hromada-page="${g.key}:${i}" aria-label="${T('Page {n} of {total}', { n: i + 1, total: pages })}" aria-current="${i === page}"></button>`).join('')}</div>` : '';
    return `<div class="hrom-group" data-hromada-group="${g.key}">
      <p class="col-title">${g.title} <span class="text-gray-500 font-normal ml-1">${g.list.length}</span></p>
      <p class="hrom-desc">${g.desc}</p>
      <div class="space-y-2">${shown.map(r => hromadaRow(r.p, r.places)).join('')}</div>
      ${dots}
    </div>`;
  }).join('');
}

// --- Where we could grow: eco-goal hromadas with none of our places, in columns by goal category ---
function renderHromadaGoals() {
  const el = document.getElementById('hromada-goals');
  if (!el || !LOCATIONS.geo) return;
  const cats = LOCATIONS.geo.categories;
  const goals = LOCATIONS.geo.features.map(f => f.properties).filter(p => p.ecoGoal);
  el.innerHTML = Object.entries(cats).map(([key, c]) => {
    const list = goals.filter(p => p.ecoGoal.category === key);
    if (!list.length) return '';
    return `<div>
      <p class="col-title mb-2"><span class="col-dot" style="background:${c.color}"></span>${esc(LANG === 'uk' ? c.uk : c.en)} <span class="text-gray-500 font-normal ml-1">${list.length}</span></p>
      <div class="space-y-2">${list.map(p => `
        <div class="goal-item">
          <span class="text-gray-200">${esc(hromadaLabel(p))}</span>
          <span class="text-gray-500"> · ${esc(oblastLabel(p))}</span>
          ${p.ecovillages.length ? `<span class="goal-ours">${T('{n} ecovillages', { n: p.ecovillages.length })} ${T('already here')}</span>` : ''}
          <p>${esc(LANG === 'uk' ? p.ecoGoal.uk : p.ecoGoal.en)}</p>
        </div>`).join('')}</div>
    </div>`;
  }).join('');
}

// --- Place detail (modal): everything about one place, with its own map ---
let detailMap = null;

function closeLocationDetail() {
  const el = document.getElementById('loc-detail');
  if (!el || el.classList.contains('hidden')) return;
  el.classList.add('hidden');
  document.body.style.overflow = '';
  if (detailMap) { detailMap.remove(); detailMap = null; }
  if (location.hash.startsWith('#places/')) history.replaceState(null, '', location.pathname + location.search + '#places');
}

function openLocationDetail(id) {
  const l = LOCATIONS.reg && LOCATIONS.reg.locations.find(x => x.id === id);
  const el = document.getElementById('loc-detail');
  if (!l || !el) return;
  if (window.showTab) window.showTab('places');
  const s = locationStats(l, LOCATIONS.data);
  const h = l.hromada && hromadaProps(l.hromada);
  const cat = h && h.ecoGoal && LOCATIONS.geo.categories[h.ecoGoal.category];
  const neighbours = h ? (hromadaStats(LOCATIONS.data)[h.code] || []).filter(x => x.id !== l.id) : [];
  const section = (title, body) => body ? `<div class="loc-d-sec"><p class="loc-d-title">${title}</p>${body}</div>` : '';
  const rows = metricRows(s).filter(([i]) => !(i === '🏡' && s.pom.length)); // community facts get their own section

  const community = s.pom.map(p => `<div class="loc-d-row"><span>🏡</span><span><b>${esc(p.name)}</b>${p.type ? ' · ' + esc(p.type) : ''}${p.founded ? ' · ' + T('since {y}', { y: p.founded }) : ''}${pomFacts(p) ? '<br>' + pomFacts(p) : ''}</span></div>`).join('');
  let hromada = '';
  if (h) {
    hromada += `<div class="loc-d-row"><span>🏛</span><span><b>${esc(hromadaLabel(h))}</b> · ${esc(oblastLabel(h))}${h.population ? ' · ' + T('{n} people', { n: fmtN(h.population) }) : ''}</span></div>`;
    if (neighbours.length) hromada += `<div class="loc-d-row"><span>📍</span><span>${T('Also here')}: ${neighbours.map(x => `<button type="button" class="loc-link" data-open-loc="${x.id}">${esc(locName(x))}</button>`).join(', ')}</span></div>`;
    if (h.ecovillages.length) hromada += `<div class="loc-d-row"><span>🌱</span><span>${T('Ecovillages')}: ${h.ecovillages.map(esc).join(', ')}</span></div>`;
    if (cat) hromada += `<div class="loc-d-row"><span>🎯</span><span><b style="color:${cat.color}">${esc(LANG === 'uk' ? cat.uk : cat.en)}</b>: ${esc(LANG === 'uk' ? h.ecoGoal.uk : h.ecoGoal.en)}</span></div>`;
  }
  const links = s.urls.map(u => `<a href="${u.url}" target="_blank" rel="noopener">${esc(LOC_SOURCES[u.src].label)}: ${esc(u.label)} →</a>`).join('');
  // Regen Bank checkout (js/regenbank.js): same buy modal as the INAT list on the dashboard
  const buy = window.RegenBank ? s.buy.map(b => `<div class="loc-d-row items-center"><span>💳</span><span class="flex-1">${s.buy.length > 1 ? esc(placeName('inat', b.name, T(b.name))) : T('Eco-credits')} · INAT</span><button type="button" class="rb-buy-btn" data-rb-buy="${b.listing}" data-rb-name="${esc(b.name)}" data-rb-url="${b.url}">${T('Buy')}</button></div>`).join('') : '';
  const unsure = (l.unsure || []).map(t => `<p class="loc-unsure">⚠ ${esc(T(t))}</p>`).join('');

  el.querySelector('.loc-d-body').innerHTML = `
    <div class="loc-d-head">
      <div class="min-w-0">
        <h3 class="loc-d-name">${esc(locName(l))}</h3>
        <p class="loc-sub">${h ? esc(hromadaLabel(h)) + ' · ' + esc(oblastLabel(h)) : l.lat == null ? T('no coordinates yet') : T('outside hromada boundaries')}</p>
        <div class="flex flex-wrap gap-1 mt-2">${s.sources.map(k => `<span class="card-badge ${LOC_SOURCES[k].badge}">${T(LOC_SOURCES[k].label)}</span>`).join('')}</div>
      </div>
      <button type="button" class="loc-d-close" data-close-detail aria-label="${T('Close')}">✕</button>
    </div>
    <div class="loc-d-grid">
      <div>${l.lat != null ? '<div id="loc-detail-map"></div>' : `<div class="loc-d-nomap">${T('No coordinates yet. Ask the network coordinator where this place is.')}</div>`}</div>
      <div>
        ${section(T('What is measured here'), rows.length ? rows.map(([i, t]) => `<div class="loc-d-row"><span>${i}</span><span>${t}</span></div>`).join('') : `<p class="loc-empty">${T('Listed on a platform; no numbers yet')}</p>`)}
        ${section(T('Buy eco-credits'), buy)}
        ${section(T('Community map'), community)}
        ${section(T('Hromada'), hromada)}
        ${section(T('Sources'), links ? `<div class="loc-links">${links}</div>` : '')}
        ${unsure}
      </div>
    </div>`;
  if (buy) window.RegenBank.refreshButtons(el);
  el.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  history.replaceState(null, '', location.pathname + location.search + '#places/' + l.id);

  if (detailMap) { detailMap.remove(); detailMap = null; }
  if (l.lat != null && typeof L !== 'undefined') {
    try {
      detailMap = createBaseMap('loc-detail-map');
      const f = h && LOCATIONS.geo.features.find(x => x.properties.code === h.code);
      if (f) {
        const shape = L.geoJSON(f, { style: { color: '#2dd4bf', weight: 1.5, fillColor: '#2dd4bf', fillOpacity: 0.12 }, interactive: false }).addTo(detailMap);
        detailMap.fitBounds(shape.getBounds(), { padding: [20, 20], maxZoom: 12 });
      } else detailMap.setView([l.lat, l.lng], 11);
      const others = LOCATIONS.reg.locations.filter(x => x.lat != null && x.id !== l.id);
      others.forEach(x => L.marker([x.lat, x.lng], { icon: L.divIcon({ className: 'custom-marker', html: '<div class="loc-dot loc-dot-dim"></div>', iconSize: [10, 10], iconAnchor: [5, 5] }), title: locName(x) })
        .on('click', () => openLocationDetail(x.id)).addTo(detailMap));
      L.marker([l.lat, l.lng], { icon: L.divIcon({ className: 'custom-marker', html: '<div class="loc-dot loc-dot-on"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }), zIndexOffset: 1000 }).addTo(detailMap);
    } catch (err) { console.warn('[Places] detail map failed:', err); }
  }
}

function wireLocationClicks() {
  document.addEventListener('click', e => {
    const open = e.target.closest('[data-open-loc]');
    if (open) { openLocationDetail(open.dataset.openLoc); return; }
    if (e.target.closest('[data-close-pin]')) { selectPin(null); return; }
    const pg = e.target.closest('[data-hromada-page]');
    if (pg) {
      const [key, i] = pg.dataset.hromadaPage.split(':');
      LOCATIONS.hromadaPage[key] = Number(i);
      renderHromadaList();
      const grp = document.querySelector(`[data-hromada-group="${key}"]`);
      if (grp && grp.getBoundingClientRect().top < 0) grp.scrollIntoView({ block: 'start' });
      return;
    }
    if (e.target.closest('[data-close-detail]') || e.target.id === 'loc-detail') closeLocationDetail();
  }, true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !document.querySelector('.rb-overlay')) closeLocationDetail(); });
}

// Called with mock data on first paint, then again once live data has merged
async function renderLocations(data) {
  LOCATIONS.data = data;
  if (!LOCATIONS.wired) {
    LOCATIONS.wired = true;
    const ok = LOCATIONS.reg || await loadLocationFiles();
    if (!ok) { const b = document.getElementById('block-locations'); if (b) b.classList.add('hidden'); return; }
    wireLocationClicks();
    const m = location.hash.match(/^#places\/(.+)$/);
    if (m) setTimeout(() => openLocationDetail(decodeURIComponent(m[1])), 0);
  }
  renderLocationSummary();
  renderLocationFilters();
  renderLocationCards();
  renderHromadaList();
  renderHromadaGoals();
  window.drawPins();
  // An open place detail was drawn from the earlier data (e.g. mock on a deep link): redraw it with the new numbers
  const open = document.getElementById('loc-detail');
  const m = location.hash.match(/^#places\/(.+)$/);
  if (open && !open.classList.contains('hidden') && m) openLocationDetail(decodeURIComponent(m[1]));
}
