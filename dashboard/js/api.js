// ============================================================
// GEN Ukraine Impact Dashboard — Blockchain API Integration
// Fetches real data from Polygon & Celo Blockscout APIs
// ============================================================

const BLOCKCHAIN_CONFIG = {
  arkreen: {
    explorerBase: 'https://explorer.arkreen.com',
  },
  hypercerts: {
    baseUrl: 'https://celo.blockscout.com/api',
    v2BaseUrl: 'https://celo.blockscout.com/api/v2',
    contract: '0x16bA53B74c234C870c61EFC04cD418B8f2865959',
    certs: [
      {
        id: 'hypercert_1',
        title: 'Ecovillage Network GEN Ukraine',
        claimType: 'ecosystem restoration',
        tokenId: '46958966635089507957945695825584013180928',
        url: 'https://app.hypercerts.org/hypercerts/42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-46958966635089507957945695825584013180928',
        metrics: {
          hectares: 163,
          trees: 2000,
          waterSystems: 5,
          lakesRestored: 4, // hectares
          riverCleared: 100, // meters
          ecovillages: 11,
        },
      },
      {
        id: 'hypercert_2',
        title: 'Water Save System for Ecovillages',
        claimType: 'water infrastructure',
        tokenId: '83369179895629923548526778820783211806720',
        url: 'https://app.hypercerts.org/hypercerts/42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-83369179895629923548526778820783211806720',
        metrics: {
          waterSystems: 9,
          waterStorageLiters: 65000,
          wellsDrilled: 4,
          lakesRestored: 3,
          livestockSecured: 120,
          ecovillages: 9,
        },
      },
    ],
  },
  inat: {
    baseUrl: 'https://celo.blockscout.com/api',
    v2BaseUrl: 'https://celo.blockscout.com/api/v2',
    marketplace: '0xB5f38750241F465CBC8279F55FE0FA37dF3DA2D2',
    carbonBatch: '0xca698BcFe41d672dFd4AD8BC417109957da0Ea16',
    coBank: '0x9b3C48fB5E8C53BF332275fDe592f39935A07e06',
    issuer: '0xB8325075Ee39A5957d356BE992a22f88542D46D6',
    projects: [
      { name: 'Tepla Gora', batch: 26, listing: 25, url: 'https://app.regentokenomics.org/project/inat/tepla-gora' },
      { name: 'Verkhniy Byshkin', batch: 27, listing: 20, url: 'https://app.regentokenomics.org/project/inat/verkhniy-byshkin' },
      { name: 'Living Home (Dudkivka)', batch: 28, listing: 21, url: 'https://app.regentokenomics.org/project/inat/dudkivka-living-home' },
      { name: 'Hora Lyskivka', batch: 29, listing: 22, url: 'https://app.regentokenomics.org/project/inat/hora-lyskivka' },
      { name: 'Lagulske (Zhytomyr)', batch: 30, listing: 23, url: 'https://app.regentokenomics.org/project/inat/lagulske' },
      { name: 'Yemelyanivka', batch: 31, listing: 24, url: 'https://app.regentokenomics.org/project/inat/yemelyanivka' },
    ],
  },
  giveth: {
    projects: [
      {
        name: 'Regenerating Ukraine: A Cause for Communities, Resilience & Climate',
        type: 'cause',
        raised: 436.73,
        donors: 25,
        givDistributed: 431717,
        url: 'https://giveth.io/cause/regenerating-ukraine:-a-cause-for-communities-resilience-climate',
      },
      {
        name: 'Revitalizing Bike Workshops to Support Ecovillages',
        type: 'project',
        raised: 1538.52,
        donors: 59,
        url: 'https://giveth.io/project/revitalizing-bike-workshops-to-support-ecovillages',
      },
    ],
  },
  karma: {
    community: 'GEN Ukraine Community',
    url: 'https://www.karmahq.xyz/community/gen-ukraine-community',
    description: 'Localism + microgrants — community projects tracker',
  },
  sarafu: {
    baseUrl: 'https://celo.blockscout.com/api',
    v2BaseUrl: 'https://celo.blockscout.com/api/v2',
    explorerBase: 'https://sarafu.network/pools',
    trpcBase: 'https://sarafu.network/api/trpc',
    pools: [
      {
        id: 'sarafu_1',
        name: 'Toloka Regeneration',
        address: '0x4393f9Caa41b48a43CC9A99123cF6224573bF10c',
        category: 'solar / energy',
      },
      {
        id: 'sarafu_2',
        name: 'Solar Support Pool',
        address: '0x236AA6982e75Bb133932a3B52329f5600049233d',
        category: 'microgrants',
      },
      {
        id: 'sarafu_3',
        name: 'GEN Fund MicroGrants Pool',
        address: '0x34317Aed39356aBd482299595d42aEEF03EB62Da',
        category: 'community',
      },
      {
        id: 'sarafu_4',
        name: 'GEN Activities',
        address: '0x0b8525c9356E5424E6B961498C8Ff33E16fD8b17',
        category: 'community',
      },
    ],
    // Settlement vouchers
    vouchers: [
      { name: 'Tepla Hora', address: '0x096305EA606B1D5dC710eDae23c8a07993a323ab' },
      { name: 'Omelyanivka', address: '0x100546fa90ce08FB0Fc77E8fc4b15437aFDCFd6d' },
      { name: 'Svitanok', address: '0x70325D3d9a7276C2444CaE3025E4E9C9BE3996cD' },
      { name: 'Happy People', address: '0x8c7b8148117E6d6A37eB789E48107B371308b61a' },
      { name: 'Charivne', address: '0x0F5BE6FAd57cC3813210Fc95e436B78E3Fec5CB9' },
      { name: 'Living Home', address: '0x4BB4D96840Ee960cE103abe3409Afde450E81F29' },
      { name: 'Radaria', address: '0x36068337faA077351b7Cd73eE1eD39f2801031A4' },
      { name: 'Hobbit Terra', address: '0x38ccBFDb0CD66ad7c102d73029493F60671Fa91B' },
      { name: 'Sunrise Ecovillage', address: '0x00cdeEF9A70E0b8128055adD3dE3c48f745E5b98' },
      { name: 'Bushanska Toloka', address: '0x386E88BA20EF11c8E04f4904038A05CBAfD91199' },
      { name: 'MaistryMy', address: '0x640799065442b9Fed96edeA7Ee38FdCF03584c41' },
      { name: 'Etnokod', address: '0xD7B95aaD5cec0aD8cb4350eE51521B63674444FF' },
      { name: 'New Mayapur', address: '0x2bB8552D246640ff2e51E72Bfd3B822d11ba7C41' },
      { name: 'Dzin Space', address: '0xC013697bA7aDb9b29C58186234f0A304A3B43979' },
      { name: 'Potoky', address: '0x339C049CCa1E33607eb6cd0FdD1Cb20541ca1953' },
      { name: 'Velyka Rodyna', address: '0xf4C346853d2dd9e5049acEcB5fF824d256a281E5' },
      { name: 'Prilestnoe', address: '0x8204605eCD0052A6340CbA512fB68aF911d9f3c0' },
      { name: 'Rodniki', address: '0xc4b2Ea06AC1e8617FEE636Fc10152bFD0baF7Cda' },
      { name: 'Space of Love', address: '0x24fa9fA92fC131c94Cac9F2C15DA1147CE77F3d6' },
      { name: 'Eco-center School Life', address: '0x2F559036B4D4ceD968b4E8a120b750A0c45953F5' },
      { name: 'Pokuttya School', address: '0x3b36c220617e1810932393219A94Cc7Ae0edaD0e' },
      { name: 'Ohra Workshop', address: '0x4ceEC475B783ED868D70f0B822Ac880E93331f74' },
      { name: 'Veloselo', address: '0x8f7597F01870496a35f2621e4F7Cd5432B795D9D' },
      { name: 'Prostir Lyubovi', address: '0xf05f36b8e3216875cE12330bd73Fe77Fa2a035BE' },
      { name: 'Lubodarove EcoHub', address: '0xaB6a92480A409246dd58f55f506DB5F21cd5B1fD' },
      { name: 'Veseli Kurkuli', address: '0x96597fdC85D1b3e287f45a76FF00bF67EC2aBc65' },
    ],
  },
};

// --- Fetch with timeout ---

function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

// --- Blockscout V1 API helpers ---

async function blockscoutGet(baseUrl, params) {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetchWithTimeout(url.toString());
  if (!res.ok) throw new Error(`Blockscout API error: ${res.status}`);
  const json = await res.json();
  if (json.status === '0' && json.message === 'NOTOK') {
    throw new Error(`Blockscout: ${json.result || 'unknown error'}`);
  }
  return json;
}

// --- Blockscout V2 API helpers ---

async function blockscoutV2Get(v2BaseUrl, path) {
  const res = await fetchWithTimeout(`${v2BaseUrl}${path}`);
  if (!res.ok) throw new Error(`Blockscout V2 API error: ${res.status}`);
  return res.json();
}

// Follow Blockscout V2 pagination (50 items/page). The old V1 /api?module=account endpoints
// now answer HTTP 429 for everyone, so everything goes through V2.
async function blockscoutV2Paged(v2BaseUrl, path, maxPages = 40) {
  const items = [];
  let query = '';
  for (let page = 0; page < maxPages; page++) {
    const json = await blockscoutV2Get(v2BaseUrl, `${path}${query}`);
    items.push(...(json.items || []));
    if (!json.next_page_params) break;
    query = '?' + new URLSearchParams(json.next_page_params).toString();
  }
  return items;
}

// Get transaction list for an address (normalised: from/to are address strings)
async function getTxList(v2BaseUrl, address) {
  const items = await blockscoutV2Paged(v2BaseUrl, `/addresses/${address}/transactions`);
  return items.map(tx => ({ ...tx, from: tx.from && tx.from.hash, to: tx.to && tx.to.hash }));
}

// Get token transfers for an address (normalised: from/to are address strings)
async function getTokenTransfers(v2BaseUrl, address) {
  const items = await blockscoutV2Paged(v2BaseUrl, `/addresses/${address}/token-transfers`);
  return items.map(tx => ({ ...tx, from: tx.from && tx.from.hash, to: tx.to && tx.to.hash }));
}

// Get token holdings for address via V2 API
async function getTokenHoldings(v2BaseUrl, address) {
  try {
    const data = await blockscoutV2Get(v2BaseUrl, `/addresses/${address}/tokens`);
    if (!data.items) return [];
    return data.items
      .filter(item => {
        const name = (item.token && item.token.name) || '';
        // Filter out spam/scam tokens
        return !name.includes('Claim:') && !name.includes('Reward at') &&
               !name.includes('visit to claim') && !name.includes('.lol') &&
               !name.includes('.icu') && !name.includes('.cfd') &&
               !name.includes('Voucher') && !name.includes('MAGA') &&
               name.length < 50;
      })
      .map(item => {
        const t = item.token || {};
        const dec = parseInt(t.decimals || '18', 10);
        return {
          name: t.name || '?',
          symbol: t.symbol || '?',
          balance: parseInt(item.value || '0', 10) / Math.pow(10, dec),
          address: t.address,
        };
      });
  } catch {
    return [];
  }
}

// Get pool token balances via V2 API (Sarafu pools on Celo)
async function getPoolTokens(v2BaseUrl, address) {
  try {
    const data = await blockscoutV2Get(v2BaseUrl, `/addresses/${address}/tokens`);
    if (!data.items) return [];
    return data.items.map(item => {
      const t = item.token || {};
      const dec = parseInt(t.decimals || '18', 10);
      return {
        name: t.name || '?',
        symbol: t.symbol || '?',
        balance: parseInt(item.value || '0', 10) / Math.pow(10, dec),
        address: t.address,
      };
    });
  } catch {
    return [];
  }
}

// --- Arkreen site data (pre-fetched static JSON) ---
// Data is pre-fetched via scripts/fetch-arkreen-miners.sh and stored in data/arkreen-miners.json
// Arkreen's API (costdownapi.arkreen.com) does not support CORS, so we load from a static snapshot

async function fetchArkreenMiners() {
  const res = await fetchWithTimeout('data/arkreen-miners.json', 10000);
  if (!res.ok) throw new Error(`Failed to load arkreen-miners.json: ${res.status}`);
  return res.json();
}

// --- Arkreen data fetching ---

async function fetchArkreenData() {
  const cfg = BLOCKCHAIN_CONFIG.arkreen;

  const minersData = await fetchArkreenMiners().catch(err => {
    console.warn('[Arkreen] Failed to load miners JSON:', err.message);
    return null;
  });

  // Monthly generation snapshot (scripts/fetch-arkreen-monthly.mjs). Arkreen's owner-level energy total
  // counts Remote miners only, so Standard miners' lifetime energy is added on top of it.
  const monthly = await fetchWithTimeout('data/arkreen-monthly.json', 10000)
    .then(r => (r.ok ? r.json() : null))
    .catch(() => null);
  const standardKwh = {};
  ((monthly && monthly.sites) || []).forEach(s => { standardKwh[s.address.toLowerCase()] = s.standardKwh || 0; });

  const minerResults = minersData ? minersData.miners.map(m => ({
    ...m,
    totalKwh: (m.totalKwh || 0) + (standardKwh[m.address.toLowerCase()] || 0),
    explorerUrl: `${cfg.explorerBase}/accounts/${m.address}`,
    live: !m.error,
  })) : [];

  const totalMinerKwh = minerResults.reduce((sum, m) => sum + (m.totalKwh || 0), 0);
  const totalMinerReward = minersData ? minersData.totalReward : 0;

  return {
    miners: minerResults,
    totalMinerKwh,
    totalMinerReward,
    solarNodes: minerResults.length,
    fetchedAt: minersData ? minersData.fetchedAt : null,
    monthly,
  };
}

// --- Sarafu data fetching ---

async function fetchSarafuData() {
  const cfg = BLOCKCHAIN_CONFIG.sarafu;

  // Preferred: static snapshot built by scripts/fetch-chain-snapshots.mjs (avoids Blockscout 429s)
  try {
    const snap = await fetchWithTimeout('data/sarafu-pools.json', 10000);
    if (snap.ok) return await snap.json();
  } catch { /* fall through to live fetch */ }

  // Fetch all pools in parallel
  const poolPromises = cfg.pools.map(async (pool) => {
    try {
      const [txList, tokenTx, poolTokens] = await Promise.all([
        getTxList(cfg.v2BaseUrl, pool.address),
        getTokenTransfers(cfg.v2BaseUrl, pool.address),
        getPoolTokens(cfg.v2BaseUrl, pool.address),
      ]);

      const poolParticipants = new Set();
      txList.forEach(tx => {
        if (tx.from) poolParticipants.add(tx.from.toLowerCase());
        if (tx.to) poolParticipants.add(tx.to.toLowerCase());
      });
      tokenTx.forEach(tx => {
        if (tx.from) poolParticipants.add(tx.from.toLowerCase());
        if (tx.to) poolParticipants.add(tx.to.toLowerCase());
      });

      return {
        ...pool,
        transactions: txList.length,
        tokenTransfers: tokenTx.length,
        members: poolParticipants.size,
        tokens: poolTokens,
        url: `${cfg.explorerBase}/${pool.address}`,
      };
    } catch (err) {
      console.warn(`[Sarafu] Failed to fetch ${pool.name}:`, err.message);
      return { ...pool, transactions: 0, tokenTransfers: 0, members: 0, tokens: [], error: true };
    }
  });

  const poolResults = await Promise.all(poolPromises);

  const totalTransactions = poolResults.reduce((sum, p) => sum + p.transactions, 0);
  const totalTokenTransfers = poolResults.reduce((sum, p) => sum + p.tokenTransfers, 0);
  const allParticipants = new Set();
  poolResults.forEach(p => {
    // Re-count from the pool's member count isn't ideal, but we track via the set above
  });
  // Get unique participants across all pools from token transfers
  const globalParticipants = new Set();
  poolResults.forEach(p => {
    // members count is per-pool, for global count we sum unique
    // This is an approximation; for exact count we'd need to merge sets
  });

  return {
    pools: poolResults,
    totalTransactions,
    totalTokenTransfers,
    activeWallets: poolResults.reduce((sum, p) => sum + p.members, 0),
    totalPools: poolResults.length,
  };
}

// --- Sarafu Reports (pre-fetched static JSON) ---
// Data is pre-fetched via scripts/fetch-sarafu-reports.sh and stored in data/sarafu-reports.json
// Sarafu tRPC API does not support CORS, so we load from a static snapshot

async function fetchSarafuReports() {
  const res = await fetchWithTimeout('data/sarafu-reports.json', 10000);
  if (!res.ok) throw new Error(`Failed to load sarafu-reports.json: ${res.status}`);
  return res.json();
}

// --- Hypercerts data fetching ---

async function fetchHypercertsData() {
  const cfg = BLOCKCHAIN_CONFIG.hypercerts;

  // Preferred: static snapshot built by scripts/fetch-chain-snapshots.mjs (avoids Blockscout 429s)
  try {
    const snap = await fetchWithTimeout('data/hypercerts.json', 10000);
    if (snap.ok) return await snap.json();
  } catch { /* fall through to live fetch */ }
  const txList = await getTxList(cfg.v2BaseUrl, cfg.contract);

  // Fetch holder count for each cert
  const certPromises = cfg.certs.map(async (c) => {
    try {
      const data = await blockscoutV2Get(cfg.v2BaseUrl,
        `/tokens/${cfg.contract}/instances/${c.tokenId}`);
      return { ...c, holders: data.token?.holders_count || null, live: true };
    } catch {
      return { ...c, holders: null, live: true };
    }
  });

  const certs = await Promise.all(certPromises);

  return {
    certs,
    totalClaims: txList.length,
  };
}

// --- INAT Eco-Credits data fetching ---

// Get USDC token transfers for a specific transaction
async function getTxTokenTransfers(v2BaseUrl, txHash) {
  try {
    const data = await blockscoutV2Get(v2BaseUrl, `/transactions/${txHash}/token-transfers`);
    if (!data.items) return [];
    return data.items;
  } catch {
    return [];
  }
}

async function fetchInatData() {
  const cfg = BLOCKCHAIN_CONFIG.inat;

  // Preferred: static snapshot built by scripts/fetch-inat.mjs (Blockscout rate-limits browsers with 429)
  try {
    const snap = await fetchWithTimeout('data/inat.json', 10000);
    if (snap.ok) return await snap.json();
  } catch { /* fall through to live fetch */ }

  const [marketplaceTxs, carbonTxs] = await Promise.all([
    blockscoutV2Get(cfg.v2BaseUrl, `/addresses/${cfg.marketplace}/transactions`),
    getTxList(cfg.v2BaseUrl, cfg.carbonBatch),
  ]);

  // Count buyCredits transactions
  const allTxs = marketplaceTxs.items || [];
  // Marketplace is a proxy, so Blockscout doesn't decode method names — match the raw selector
  const purchases = allTxs.filter(tx => tx.status === 'ok' && (tx.raw_input || '').toLowerCase().startsWith('0x479c8457'));

  // Extract purchase details
  const purchaseDetails = purchases.map(tx => {
    const raw = tx.raw_input || '';
    const word = i => parseInt(raw.slice(10 + i * 64, 10 + (i + 1) * 64) || '0', 16);
    return {
      hash: tx.hash || '',
      date: (tx.timestamp || '').slice(0, 10),
      listingId: word(0),
      amount: word(1),
      buyer: tx.from && tx.from.hash ? tx.from.hash : '',
    };
  });

  // Calculate per-tx revenue from USDC transfers and attach to each purchase
  const revenuePromises = purchaseDetails.map(async (purchase) => {
    if (!purchase.hash) return 0;
    const transfers = await getTxTokenTransfers(cfg.v2BaseUrl, purchase.hash);
    let txTotal = 0;
    transfers.forEach(t => {
      const token = t.token || {};
      const sym = (token.symbol || '').toUpperCase();
      if (sym.includes('USD')) {
        const total = t.total || {};
        const dec = parseInt(total.decimals || token.decimals || '6', 10);
        const val = parseInt(total.value || '0', 10) / Math.pow(10, dec);
        txTotal += val;
      }
    });
    return txTotal;
  });
  const revenues = await Promise.all(revenuePromises);
  revenues.forEach((r, i) => { purchaseDetails[i].revenue = r; });
  const totalRevenue = revenues.reduce((sum, r) => sum + r, 0);

  // INAT carbon credits use 6 decimals
  const CREDIT_DECIMALS = 1e6;
  const totalCreditsSold = purchaseDetails.reduce((sum, p) => sum + p.amount, 0) / CREDIT_DECIMALS;

  // Map purchases to projects by listing ID
  const projectsWithSales = cfg.projects.map(proj => {
    const sales = purchaseDetails.filter(p => p.listingId === proj.listing);
    const totalCreditsRaw = sales.reduce((sum, s) => sum + s.amount, 0);
    const projRevenue = sales.reduce((sum, s) => sum + (s.revenue || 0), 0);
    return {
      ...proj,
      sales: sales.length,
      totalCredits: totalCreditsRaw / CREDIT_DECIMALS,
      revenue: projRevenue,
      live: true,
    };
  });

  return {
    projects: projectsWithSales,
    totalPurchases: purchases.length,
    totalCreditsSold,
    totalListings: allTxs.filter(tx => (tx.method || '').includes('0xebc34929')).length,
    cancelledListings: allTxs.filter(tx => tx.method === 'cancelListing').length,
    totalRevenue,
    carbonBatchTxs: carbonTxs.length,
  };
}

// --- Bird monitoring: BirdWeather listening stations (public REST API, CORS-enabled) ---
// Positions come from the project sheet; BirdWeather hides the exact position of private stations,
// so approx marks a marker placed by hand near the real site.
const BIRD_STATIONS = [
  { id: 2912, name: 'Supii Lake', lat: 50.316551, lng: 31.737823, approx: false },
  { id: 26098, name: 'Trokhy Dali', lat: 49.428169, lng: 30.846943, approx: false },
  { id: 22407, name: 'Chornobyl Wildlife 2', lat: 51.276, lng: 30.222, approx: true },
];

async function fetchBirdData() {
  const base = 'https://app.birdweather.com/api/v1/stations';
  const getJson = async (url) => {
    const res = await fetchWithTimeout(url, 12000);
    if (!res.ok) throw new Error(`BirdWeather ${res.status}`);
    return res.json();
  };

  const stations = await Promise.all(BIRD_STATIONS.map(async (s) => {
    const [info, stats, species] = await Promise.all([
      getJson(`${base}/${s.id}`),
      getJson(`${base}/${s.id}/stats?period=month`),
      getJson(`${base}/${s.id}/species?period=month&limit=300`),
    ]);
    const list = species.species || [];
    return {
      ...s,
      live: !!info.live,
      lastAt: info.latestDetectionAt || null,
      detections: stats.detections || 0,
      speciesCount: stats.species || list.length,
      speciesNames: list.map(x => x.scientificName),
      top: list.slice(0, 3).map(x => ({ name: x.commonName, sci: x.scientificName, count: (x.detections && x.detections.total) || 0 })),
    };
  }));

  return {
    stations,
    totalDetections: stations.reduce((sum, s) => sum + s.detections, 0),
    totalSpecies: new Set(stations.flatMap(s => s.speciesNames)).size,
  };
}

// --- Silvi snapshot (scripts/fetch-silvi.mjs): area, map position, recorded trees per project ---
async function fetchSilviData() {
  const res = await fetchWithTimeout('data/silvi.json', 10000);
  if (!res.ok) throw new Error(`Failed to load silvi.json: ${res.status}`);
  return res.json();
}

function mergeSilviIntoData(data, silvi) {
  if (!silvi || !Array.isArray(silvi.projects)) return;
  const byId = new Map(silvi.projects.map(p => [p.id, p]));
  const statusLabel = s => ({ approved: 'Approved', draft: 'Draft' }[s] || (s ? s.charAt(0).toUpperCase() + s.slice(1) : 'No status'));

  (data.silviProjects || []).forEach(p => {
    const s = byId.get(p.id);
    if (!s) return;
    if (Number.isFinite(s.lat) && Number.isFinite(s.lng)) { p.lat = s.lat; p.lng = s.lng; }
    if (typeof s.areaHa === 'number') p.hectares = s.areaHa;
    p.status = statusLabel(s.status);
    // Individual tree records win; otherwise count the GPS-tagged planting logs (the points on the Silvi map)
    p.trees = typeof s.trees === 'number' && s.trees > 0 ? s.trees
      : typeof s.logs === 'number' && s.logs > 0 ? s.logs : null;
  });

  // Projects in the snapshot that the static list doesn't know yet (e.g. a key added to .env later)
  const known = new Set((data.silviProjects || []).map(p => p.id));
  silvi.projects.filter(s => !known.has(s.id)).forEach(s => {
    const trees = typeof s.trees === 'number' && s.trees > 0 ? s.trees
      : typeof s.logs === 'number' && s.logs > 0 ? s.logs : null;
    const hectares = typeof s.areaHa === 'number' ? s.areaHa : 0;
    data.silviProjects = data.silviProjects || [];
    data.silviProjects.push({
      id: s.id, name: s.title, desc: '', status: statusLabel(s.status),
      lat: Number.isFinite(s.lat) ? s.lat : null, lng: Number.isFinite(s.lng) ? s.lng : null,
      hectares, zones: s.zones, trees,
    });
    if (data.ecology) {
      data.ecology.projects = data.ecology.projects || [];
      data.ecology.projects.push({ name: s.title, platform: 'Silvi', trees, hectares });
    }
  });

  // Show approved projects only (drafts are not verified by Silvi yet)
  data.silviProjects = (data.silviProjects || []).filter(p => {
    const s = byId.get(p.id);
    return !s || s.status === 'approved';
  });

  // Keep the ecology block in step with the (now authoritative) Silvi numbers
  const eco = data.ecology;
  if (eco) {
    eco.projects = (eco.projects || []).filter(ep => data.silviProjects.some(x => x.name === ep.name));
    eco.biodiversityProjects = data.silviProjects.length;
    (eco.projects || []).forEach(ep => {
      const sp = (data.silviProjects || []).find(x => x.name === ep.name);
      if (sp) { ep.hectares = sp.hectares; ep.trees = sp.trees; }
    });
    eco.habitatRestored = Math.round((data.silviProjects || []).reduce((sum, p) => sum + (p.hectares || 0), 0));
    const trees = (data.silviProjects || []).reduce((sum, p) => sum + (p.trees || 0), 0);
    eco.treesPlanted = trees > 0 ? trees : null;
  }
}

// --- Karma (GAP) community data: public REST API, CORS-enabled ---
async function fetchKarmaData() {
  const base = 'https://gapapi.karmahq.xyz/v2/communities/gen-ukraine-community';
  const [statsRes, projRes] = await Promise.all([
    fetchWithTimeout(`${base}/stats`, 10000),
    fetchWithTimeout(`${base}/projects?limit=50`, 10000),
  ]);
  if (!statsRes.ok || !projRes.ok) throw new Error(`Karma API error: ${statsRes.status}/${projRes.status}`);
  const stats = await statsRes.json();
  const proj = await projRes.json();
  const projects = (proj.payload || []).map(p => ({
    title: (p.details && p.details.title) || '',
    description: (p.details && p.details.description) || '',
    slug: (p.details && p.details.slug) || '',
    updates: p.numUpdates || 0,
    milestones: p.numMilestones || 0,
    createdAt: p.createdAt || '',
    programs: p.grantNames || [],
  }));
  return {
    totalProjects: stats.totalProjects ?? projects.length,
    totalUpdates: stats.projectUpdates ?? 0,
    programs: [...new Set(projects.flatMap(p => p.programs))],
    projects,
  };
}

// --- Giveth & Karma data (static config, no on-chain fetch needed) ---

function fetchGivethKarmaData() {
  const giveth = BLOCKCHAIN_CONFIG.giveth;
  const karma = BLOCKCHAIN_CONFIG.karma;

  const totalRaised = giveth.projects.reduce((sum, p) => sum + p.raised, 0);
  const totalDonors = giveth.projects.reduce((sum, p) => sum + (p.donors || 0), 0);
  const totalGiv = giveth.projects.reduce((sum, p) => sum + (p.givDistributed || 0), 0);

  return {
    projects: giveth.projects.map(p => ({ ...p, live: true })),
    totalRaised,
    totalDonors,
    totalProjects: giveth.projects.length,
    givDistributed: totalGiv,
    karma: {
      name: karma.community,
      url: karma.url,
      description: karma.description,
    },
  };
}

// --- Merge live data into dashboard data structure ---

function mergeArkreenIntoData(data, arkreenLive) {
  if (!arkreenLive) return;

  data.energy.akreTokens = Math.round(arkreenLive.totalMinerReward || 0);
  data.energy.solarNodes = (arkreenLive.miners || []).length;

  // Set total energy from sites (kWh → MWh)
  if (arkreenLive.totalMinerKwh > 0) {
    data.energy.totalMWh = Math.round(arkreenLive.totalMinerKwh / 1000 * 10) / 10;
    data.energy.totalKwh = Math.round(arkreenLive.totalMinerKwh);
  }

  if (arkreenLive.fetchedAt) {
    data.energy.fetchedAt = arkreenLive.fetchedAt;
  }

  // Monthly generation (only sites that have a per-day meter history)
  if (arkreenLive.monthly && (arkreenLive.monthly.sites || []).some(s => s.hasHistory)) {
    data.energy.monthlyGeneration = {
      months: arkreenLive.monthly.months,
      sites: arkreenLive.monthly.sites.filter(s => s.hasHistory),
      totalSites: arkreenLive.monthly.sites.length,
    };
  }

  // Build nodes list: one entry per solar site
  data.energy.nodes = (arkreenLive.miners || []).map(m => ({
    name: m.name,
    wallet: m.address.slice(0, 6) + '...' + m.address.slice(-4),
    walletFull: m.address,
    tokens: Math.round(m.totalReward || 0),
    kwh: Math.round(m.totalKwh || 0),
    minerCount: m.minerCount || 0,
    explorerUrl: m.explorerUrl,
    isMiner: true,
    live: !m.error,
  }));

  // Pass daily reward data for chart (only true daily-granularity series the API exposes)
  if (arkreenLive.miners && arkreenLive.miners.length > 0) {
    const allDates = {};
    arkreenLive.miners.forEach(m => {
      (m.daily || []).forEach(d => {
        allDates[d.date] = (allDates[d.date] || 0) + d.akre;
      });
    });
    data.energy.dailyRewards = Object.entries(allDates)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, akre]) => ({ date, akre: Math.round(akre) }));

    // Per-site daily for multi-line chart
    data.energy.minerRewardDaily = arkreenLive.miners
      .filter(m => (m.daily || []).length > 0)
      .map(m => ({ name: m.name, daily: m.daily }));
  }
}

function mergeSarafuIntoData(data, sarafuLive) {
  if (!sarafuLive) return;

  data.community.activeWallets = sarafuLive.activeWallets;
  data.community.localTransactions = sarafuLive.totalTransactions;
  data.community.localExchanges = sarafuLive.totalTokenTransfers;

  // Replace mock vouchers with real pool data
  data.community.vouchers = sarafuLive.pools.map(p => ({
    settlement: p.name,
    voucher: p.category,
    transactions: p.transactions,
    members: p.members,
    url: p.url,
    tokens: p.tokens,
    live: !p.error,
  }));
}

function mergeHypercertsIntoData(data, hypercertsLive) {
  if (!hypercertsLive) return;
  data.hypercerts = hypercertsLive;
}

function mergeInatIntoData(data, inatLive) {
  if (!inatLive) return;
  data.inat = inatLive;
}

function mergeSarafuReportsIntoData(data, reportsData) {
  if (!reportsData) return;
  data.sarafuReports = reportsData;
}

function mergeFundraisingIntoData(data) {
  data.fundraising = fetchGivethKarmaData();
}

// --- Main: fetch all live data and merge ---

async function fetchAllLiveData(data) {
  console.log('[API] Fetching live blockchain data...');
  const startTime = performance.now();

  const [arkreenLive, sarafuLive, hypercertsLive, inatLive, sarafuReports, karmaLive, silviLive, birdLive] = await Promise.allSettled([
    fetchArkreenData(),
    fetchSarafuData(),
    fetchHypercertsData(),
    fetchInatData(),
    fetchSarafuReports(),
    fetchKarmaData(),
    fetchSilviData(),
    fetchBirdData(),
  ]);

  if (arkreenLive.status === 'fulfilled') {
    mergeArkreenIntoData(data, arkreenLive.value);
    console.log('[API] Arkreen data loaded:', arkreenLive.value);
  } else {
    console.warn('[API] Arkreen fetch failed, using mock data:', arkreenLive.reason);
  }

  if (sarafuLive.status === 'fulfilled') {
    mergeSarafuIntoData(data, sarafuLive.value);
    console.log('[API] Sarafu data loaded:', sarafuLive.value);
  } else {
    console.warn('[API] Sarafu fetch failed, using mock data:', sarafuLive.reason);
  }

  if (hypercertsLive.status === 'fulfilled') {
    mergeHypercertsIntoData(data, hypercertsLive.value);
    console.log('[API] Hypercerts data loaded:', hypercertsLive.value);
  } else {
    console.warn('[API] Hypercerts fetch failed:', hypercertsLive.reason);
  }

  if (inatLive.status === 'fulfilled') {
    mergeInatIntoData(data, inatLive.value);
    console.log('[API] INAT data loaded:', inatLive.value);
  } else {
    console.warn('[API] INAT fetch failed:', inatLive.reason);
  }

  if (birdLive.status === 'fulfilled') {
    data.birds = birdLive.value;
    console.log('[API] BirdWeather loaded:', birdLive.value.stations.length, 'stations');
  } else {
    console.warn('[API] BirdWeather fetch failed, bird block stays hidden:', birdLive.reason);
  }

  if (silviLive.status === 'fulfilled') {
    mergeSilviIntoData(data, silviLive.value);
    console.log('[API] Silvi snapshot loaded:', silviLive.value.projects.length, 'projects');
  } else {
    console.warn('[API] Silvi snapshot failed, keeping sheet values:', silviLive.reason);
  }

  if (karmaLive.status === 'fulfilled') {
    data.karmaLive = karmaLive.value;
    console.log('[API] Karma loaded:', karmaLive.value.totalProjects, 'projects');
  } else {
    console.warn('[API] Karma fetch failed, keeping static card:', karmaLive.reason);
  }

  if (sarafuReports.status === 'fulfilled') {
    mergeSarafuReportsIntoData(data, sarafuReports.value);
    console.log('[API] Sarafu reports loaded:', sarafuReports.value.totalReports, 'reports');
  } else {
    console.warn('[API] Sarafu reports fetch failed:', sarafuReports.reason);
  }

  // Giveth/Karma — no async fetch needed, static config
  mergeFundraisingIntoData(data);
  console.log('[API] Fundraising data loaded:', data.fundraising);

  const elapsed = Math.round(performance.now() - startTime);
  console.log(`[API] Done in ${elapsed}ms`);

  return data;
}
