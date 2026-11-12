// ============================================================
// GEN Ukraine Impact Dashboard — Map (Leaflet + OpenStreetMap)
// ============================================================

// Two maps share one basemap setup:
//   #map         (Dashboard tab) hromadas only: where the network is and where it could grow
//   #places-map  (Places tab)    points: our places, solar, water, Silvi, birds, community map
// Each map is created the first time its tab is shown (a hidden container has no size).

function createBaseMap(elId) {
  // Ukraine only: fit to its bounds and keep panning close to it
  const ukraineBounds = L.latLngBounds([44.18, 22.14], [52.38, 40.23]);
  const map = L.map(elId, {
    zoomControl: false,
    attributionControl: false,
    maxBounds: ukraineBounds.pad(0.15),
    maxBoundsViscosity: 1.0,
    zoomSnap: 0.25,
  });
  map.invalidateSize(); // container may not be laid out yet; avoids NaN bounds
  map.fitBounds(ukraineBounds, { padding: [10, 10] });
  map.setMinZoom(map.getZoom());

  // Add zoom control to bottom-right
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // OpenFreeMap "dark" vector style (free, no API key) rendered via MapLibre.
  // Labels come from OSM name:en, so cities read "Kyiv", not "Kiev".
  const basemap = L.maplibreGL({
    style: 'https://tiles.openfreemap.org/styles/dark',
    attribution: '<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
  }).addTo(map);
  // English names only (default style also prints the Cyrillic name underneath)
  const glMap = basemap.getMaplibreMap();
  const borderPromise = fetch('data/ukraine-border.json').then((r) => r.json()).catch(() => null);
  glMap.on('style.load', async () => {
    // Paint everything outside Ukraine with the card background (geoBoundaries ADM0, incl. Crimea)
    const border = await borderPromise;
    if (border) {
      const world = [[-180, -85], [180, -85], [180, 85], [-180, 85], [-180, -85]];
      glMap.addSource('outside-ukraine', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [world, border.geometry.coordinates[0]] } },
      });
      glMap.addSource('ukraine-border', { type: 'geojson', data: border });
      // Mask goes under the labels; labels outside Ukraine are filtered out instead of covered
      const layers = glMap.getStyle().layers;
      const lastShape = layers.map((l) => l.type !== 'symbol').lastIndexOf(true);
      const firstLabel = layers[lastShape + 1].id;
      glMap.addLayer({ id: 'outside-ukraine', type: 'fill', source: 'outside-ukraine', paint: { 'fill-color': '#111827' } }, firstLabel);
      glMap.addLayer({ id: 'ukraine-border', type: 'line', source: 'ukraine-border', paint: { 'line-color': '#4b5563', 'line-width': 1.2 } }, firstLabel);
      glMap.getStyle().layers.filter((l) => l.type === 'symbol').forEach((l) => {
        const within = ['within', border.geometry]; // a Feature here silently matches nothing
        glMap.setFilter(l.id, l.filter ? ['all', l.filter, within] : within);
      });
    }
    // Oblast labels crowd out city names at country zoom
    glMap.setLayoutProperty('place_state', 'visibility', 'none');
    glMap.getStyle().layers.forEach((layer) => {
      if (!layer.layout || !layer.layout['text-field'] || layer.id === 'highway_name_motorway') return;
      glMap.setLayoutProperty(layer.id, 'text-field',
        ['coalesce', ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']]);
      // Default place labels are very dim on the dark style
      if (layer.id.startsWith('place_')) glMap.setPaintProperty(layer.id, 'text-color', '#a8a8b3');
    });
  });
  L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map);
  return map;
}

// Toggle rows for a legend column; layers: [{ id, label, icon, layer, checked?, onToggle? }]
function legendToggles(map, layers) {
  return {
    html: layers.map(({ id, label, icon, checked }) => `<label class="map-legend-row" style="cursor:pointer;">
        <input type="checkbox" id="${id}" ${checked === false ? '' : 'checked'} style="width:13px; height:13px; margin:0; cursor:pointer;">
        <span style="width:16px; display:inline-flex; justify-content:center;">${icon}</span>
        <span>${label}</span>
      </label>`).join(''),
    wire() {
      layers.forEach(({ id, layer, onToggle }) => {
        const cb = document.getElementById(id);
        if (!cb) return;
        cb.addEventListener('change', function () {
          if (this.checked) map.addLayer(layer); else map.removeLayer(layer);
          if (onToggle) onToggle(this.checked);
        });
      });
    },
  };
}

// --- Dashboard tab: hromada map (shapes are drawn by js/locations.js) ---
function initHromadaMap() {
  if (!document.getElementById('map')) return;
  const map = createBaseMap('map');
  const ourHromadaLayer = L.layerGroup().addTo(map);
  const goalHromadaLayer = L.layerGroup().addTo(map);
  window.hromadaLayers = { ours: ourHromadaLayer, goals: goalHromadaLayer };
  window.dashboardMap = map;

  const div = document.getElementById('map-legend');
  if (!div) return;
  div.className += ' map-legend';
  const t = legendToggles(map, [
    { id: 'layer-our-hromadas', label: T('Hromadas with our places'), icon: '<span style="display:inline-block;width:11px;height:11px;border-radius:2px;border:1px solid #2dd4bf;background:rgba(45,212,191,0.3);"></span>', layer: ourHromadaLayer },
    { id: 'layer-eco-goal-hromadas', label: T('Hromadas with eco goals'), icon: '<span style="display:inline-block;width:11px;height:11px;border-radius:2px;background:linear-gradient(135deg,#22c55e 50%,#a78bfa 50%);opacity:0.8;"></span>', layer: goalHromadaLayer,
      onToggle: on => { const c = document.getElementById('hromada-cats'); if (c) c.style.display = on ? '' : 'none'; } },
  ]);
  div.innerHTML = '<div style="font-weight:600; margin-bottom:2px; color:#e5e7eb; font-size:0.72rem;">' + T('Layers') + '</div>'
    + '<div class="map-legend-layers">' + t.html + '</div>'
    + '<div id="hromada-cats" style="margin-top:6px; padding-top:5px; border-top:1px solid rgba(255,255,255,0.1);"></div>'
    + '<p class="map-legend-tip">' + T('Click a hromada to see what the network has there.') + '</p>';
  t.wire();
}

// --- Places tab: point map ---
function initMap(data) {
  if (!document.getElementById('places-map')) return;
  const map = createBaseMap('places-map');
  window.placesMap = map;

  // Community category colors — muted tones so project layers pop
  const categoryColors = {
    'Family Estate':        '#2d8a4e',
    'Eco-settlement':       '#45a368',
    'Eco-community':        '#6dbf8b',
    'Spiritual Community':  '#8b7ec8',
    'Various Communities':  '#a0a0a0',
  };

  // Community dot icon (small, subtle)
  function makeDot(color) {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 9px; height: 9px;
        background: ${color};
        border: 1.5px solid rgba(0,0,0,0.4);
        border-radius: 50%;
        opacity: 0.75;
      "></div>`,
      iconSize: [9, 9],
      iconAnchor: [4, 4],
      popupAnchor: [0, -6],
    });
  }

  // Project icon (solar / rainwater) — emoji-based, larger, high contrast
  function makeProjectIcon(emoji) {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        font-size: 20px;
        line-height: 1;
        filter: drop-shadow(0 0 4px rgba(0,0,0,0.7));
      ">${emoji}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -14],
    });
  }

  // --- Layer: Communities ---
  const communitiesLayer = L.layerGroup();
  data.ecovillages.forEach(v => {
    const color = categoryColors[v.category] || '#4ade80';
    L.marker([v.lat, v.lng], { icon: makeDot(color) })
      .bindPopup(`
        <div>
          <strong style="color: #a7f3d0; font-size: 0.9rem;">${T(v.name)}</strong>
          <div style="margin-top: 4px; color: #9ca3af; font-size: 0.75rem;">${T(v.category)}</div>
        </div>
      `)
      .addTo(communitiesLayer);
  });
  // Off by default: most of these points have no platform data yet

  // --- Layer: our places from the registry (filled by js/locations.js) ---
  const placesLayer = L.layerGroup().addTo(map);
  window.placesLayer = placesLayer;

  // --- Layer: Solar Stations ---
  const solarLayer = L.layerGroup();
  if (data.solarStations) {
    data.solarStations.forEach(s => {
      L.marker([s.lat, s.lng], { icon: makeProjectIcon('☀️') })
        .bindPopup(`
          <div>
            <strong style="color: #fde68a; font-size: 0.9rem;">☀️ ${T(s.name)}</strong>
            <div style="margin-top: 4px; color: #d1d5db; font-size: 0.75rem;">${T(s.desc)}</div>
          </div>
        `)
        .addTo(solarLayer);
    });
  }
  solarLayer.addTo(map);

  // --- Layer: Rainwater Harvesting ---
  const rainwaterLayer = L.layerGroup();
  if (data.rainwaterSystems) {
    data.rainwaterSystems.forEach(r => {
      L.marker([r.lat, r.lng], { icon: makeProjectIcon('💧') })
        .bindPopup(`
          <div>
            <strong style="color: #7dd3fc; font-size: 0.9rem;">💧 ${T(r.name)}</strong>
            <div style="margin-top: 4px; color: #d1d5db; font-size: 0.75rem;">${T(r.desc)}</div>
          </div>
        `)
        .addTo(rainwaterLayer);
    });
  }
  rainwaterLayer.addTo(map);

  // --- Layer: Silvi Forestry Projects (re-drawn when Silvi positions arrive with the live data) ---
  const silviLayer = L.layerGroup();
  window.refreshSilviMarkers = function (d) {
    silviLayer.clearLayers();
    (d.silviProjects || []).forEach(p => {
      if (!Number.isFinite(p.lat) || !Number.isFinite(p.lng)) return; // no position yet
      const url = `https://app.silvi.earth/?asset=zone&sourceProject=${p.id}&sourceProjectTitle=${encodeURIComponent(p.name)}`;
      L.marker([p.lat, p.lng], { icon: makeProjectIcon('🌳') })
        .bindPopup(`
          <div>
            <strong style="color: #a3e635; font-size: 0.9rem;">🌳 ${p.name}</strong>
            <div style="margin-top: 4px; color: #d1d5db; font-size: 0.75rem;">${T(p.desc || '')}</div>
            <div style="margin-top: 2px; color: #9ca3af; font-size: 0.7rem;">${p.hectares.toLocaleString(LOCALE)} ${T('ha')}</div>
            <a href="${url}" target="_blank" style="color: #a3e635; font-size: 0.7rem; text-decoration: underline;">${T('View on Silvi →')}</a>
          </div>
        `)
        .addTo(silviLayer);
    });
  };
  window.refreshSilviMarkers(data);
  silviLayer.addTo(map);
  if (window.refreshPlacesMarkers) window.refreshPlacesMarkers();

  // --- Layer: Bird monitoring stations (drawn once BirdWeather data arrives) ---
  const birdLayer = L.layerGroup();
  window.refreshBirdMarkers = function (d) {
    birdLayer.clearLayers();
    ((d.birds && d.birds.stations) || []).forEach(s => {
      L.marker([s.lat, s.lng], { icon: makeProjectIcon('🐦') })
        .bindPopup(`
          <div>
            <strong style="color: #7dd3fc; font-size: 0.9rem;">🐦 ${T(s.name)}</strong>
            <div style="margin-top: 4px; color: #d1d5db; font-size: 0.75rem;">${T('{n} detections', { n: s.detections.toLocaleString(LOCALE) })} · ${T('{n} species', { n: s.speciesCount })}</div>
            ${s.approx ? `<div style="margin-top: 2px; color: #9ca3af; font-size: 0.7rem;">${T('approximate location')}</div>` : ''}
            <a href="https://app.birdweather.com/stations/${s.id}" target="_blank" style="color: #7dd3fc; font-size: 0.7rem; text-decoration: underline;">${T('View on BirdWeather →')}</a>
          </div>
        `)
        .addTo(birdLayer);
    });
  };
  window.refreshBirdMarkers(data);
  birdLayer.addTo(map);

  // --- Interactive Legend with toggles ---
  // Rendered in its own column next to the map (below it on phones), not as an overlay,
  // so it never covers markers on small screens.
  const div = document.getElementById('places-legend');
  if (div) {
    div.className += ' map-legend';

    const layers = [
      { key: 'Our Places', label: T('Our places'), icon: '<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#2dd4bf;border:2px solid #0f172a;box-shadow:0 0 0 1px #2dd4bf;"></span>', layer: placesLayer },
      { key: 'Communities', label: T('Communities'), icon: '<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#45a368;opacity:0.75;"></span>', layer: communitiesLayer },
      { key: 'Solar Stations', label: T('Solar Stations'), icon: '<span style="font-size:14px;">☀️</span>', layer: solarLayer },
      { key: 'Rainwater Harvesting', label: T('Rainwater Harvesting'), icon: '<span style="font-size:14px;">💧</span>', layer: rainwaterLayer },
      { key: 'Silvi Forestry', label: T('Silvi Forestry'), icon: '<span style="font-size:14px;">🌳</span>', layer: silviLayer },
      { key: 'Bird Stations', label: T('Bird Stations'), icon: '<span style="font-size:14px;">🐦</span>', layer: birdLayer },
    ];

    let html = '<div style="font-weight:600; margin-bottom:2px; color:#e5e7eb; font-size:0.72rem;">' + T('Layers') + '</div><div class="map-legend-layers">';

    layers.forEach(({ key, label, icon }) => {
      const id = 'layer-' + key.replace(/\s/g, '-').toLowerCase();
      html += `<label class="map-legend-row" style="cursor:pointer;">
        <input type="checkbox" id="${id}" ${key === 'Communities' ? '' : 'checked'} style="width:13px; height:13px; margin:0; cursor:pointer;">
        <span style="width:16px; display:inline-flex; justify-content:center;">${icon}</span>
        <span>${label}</span>
      </label>`;
    });

    html += '</div>';

    // Community sub-categories
    html += '<div id="community-cats" style="display:none; margin-top:6px; padding-top:5px; border-top:1px solid rgba(255,255,255,0.1);">';
    Object.entries(categoryColors).forEach(([cat, col]) => {
      // Same row size as the layer toggles above: 13px slot (checkbox width), 6px gap, same font
      html += `<div class="map-legend-row"><span style="width:13px; display:inline-flex; justify-content:center;"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${col};"></span></span><span>${T(cat)}</span></div>`;
    });
    html += '</div>';

    div.innerHTML = html;

    // Wire up toggles
    setTimeout(() => {
      layers.forEach(({ key, layer }) => {
        const id = 'layer-' + key.replace(/\s/g, '-').toLowerCase();
        const cb = document.getElementById(id);
        if (!cb) return;
        cb.addEventListener('change', function () {
          if (this.checked) map.addLayer(layer);
          else map.removeLayer(layer);
          if (key === 'Communities') {
            const cats = document.getElementById('community-cats');
            if (cats) cats.style.display = this.checked ? '' : 'none';
          }

        });
      });
    }, 0);

  }
}
