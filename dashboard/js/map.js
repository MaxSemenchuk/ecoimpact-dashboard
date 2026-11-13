// ============================================================
// GEN Ukraine Impact Dashboard — Map (Leaflet + OpenStreetMap)
// ============================================================

// Maps share one basemap setup:
//   #map            (Dashboard tab) one pin per place that has data on a platform
//   #loc-detail-map (place detail)  the place and its hromada outline
// A map is created only once its container is visible (a hidden container has no size).

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

// --- Dashboard tab: one pin per place from the registry (pins are drawn by js/locations.js) ---
function initPinMap() {
  if (!document.getElementById('map')) return;
  const map = createBaseMap('map');
  window.pinLayer = L.layerGroup().addTo(map);
  window.dashboardMap = map;
}
