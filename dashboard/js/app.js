// ============================================================
// GEN Ukraine Impact Dashboard — App Initialization
// ============================================================

// Animated counter
// A newer write to the same element (animated or setText) cancels any older animation still running,
// so the first-paint mock values can never overwrite the live ones.
function setText(el, text) {
  if (!el) return;
  el.__animId = (el.__animId || 0) + 1;
  el.textContent = text;
}

function animateValue(el, target, suffix = '', duration = 1200) {
  if (!el) return;
  const start = 0;
  const startTime = performance.now();
  const animId = (el.__animId = (el.__animId || 0) + 1);

  function update(currentTime) {
    if (el.__animId !== animId) return; // superseded
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);

    if (target >= 1000) {
      el.textContent = current.toLocaleString(LOCALE) + suffix;
    } else {
      el.textContent = current + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Populate summary bar
function populateSummary(data) {
  const s = data.summary;
  animateValue(document.getElementById('stat-ecovillages'), s.ecovillages, '+');
  animateValue(document.getElementById('stat-participants'), s.participants, '+');
  animateValue(document.getElementById('stat-trees'), s.treesPlanted);
  animateValue(document.getElementById('stat-co2'), s.co2Sequestered, ' t');
}

// Populate energy block
function populateEnergy(data) {
  const e = data.energy;
  // Show kWh if available and less than 1 MWh, otherwise MWh
  const mwhEl = document.getElementById('energy-mwh');
  if (mwhEl) {
    if (e.totalKwh && e.totalKwh > 0) {
      if (e.totalKwh >= 1000) {
        setText(mwhEl, (e.totalKwh / 1000).toLocaleString(LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' ' + T('MWh')); // one decimal: animateValue rounds to integers
      } else {
        animateValue(mwhEl, Math.round(e.totalKwh), ' ' + T('kWh'));
      }
    } else {
      animateValue(mwhEl, e.totalMWh, ' ' + T('MWh'));
    }
  }
  animateValue(document.getElementById('energy-nodes'), e.solarNodes);
  animateValue(document.getElementById('energy-tokens'), e.akreTokens, ' AKRE');
}

// Populate ecology block
function populateEcology(data) {
  const eco = data.ecology;
  animateValue(document.getElementById('eco-projects'), eco.biodiversityProjects);
  const treesEl = document.getElementById('eco-trees');
  if (treesEl) {
    // Silvi projects have not reported tree counts yet, so fall back to the trees stated
    // in the network's on-chain Hypercert claim instead of showing an empty dash.
    const certs = (data.hypercerts && data.hypercerts.certs) || BLOCKCHAIN_CONFIG.hypercerts.certs;
    const certTrees = certs.reduce((sum, c) => sum + ((c.metrics && c.metrics.trees) || 0), 0);
    if (eco.treesPlanted != null) {
      animateValue(treesEl, eco.treesPlanted);
      treesEl.title = T('Trees recorded in Silvi: tracked trees, or GPS-tagged planting photos (the points on the Silvi map)');
    } else if (certTrees > 0) {
      animateValue(treesEl, certTrees);
      treesEl.title = T('From the Hypercert claim of the network (Silvi projects have not reported tree counts yet)');
    } else {
      treesEl.textContent = '—';
      treesEl.title = T('Not reported yet');
    }
  }
  animateValue(document.getElementById('eco-hectares'), eco.habitatRestored, ' ' + T('ha'));

  // Project list
  const list = document.getElementById('eco-project-list');
  if (list) {
    // Find matching Silvi project details for URLs
    const silvi = data.silviProjects || [];
    list.innerHTML = eco.projects.map(p => {
      const treesLabel = p.trees != null ? `🌳 ${p.trees.toLocaleString(LOCALE)}` : '';
      const silviProject = silvi.find(s => s.name === p.name);
      const mapUrl = silviProject
        ? `https://app.silvi.earth/?asset=zone&sourceProject=${silviProject.id}&sourceProjectTitle=${encodeURIComponent(silviProject.name)}`
        : null;
      const nameHtml = mapUrl
        ? `<a href="${mapUrl}" target="_blank" class="text-gray-300 hover:text-lime-400 hover:underline">${p.name}</a>`
        : `<span class="text-gray-300">${p.name}</span>`;
      return `
        <div class="flex items-center justify-between gap-3 text-xs py-1.5 border-b border-dark-600/50">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background:#a3e635"></span>
            <div class="min-w-0">${nameHtml}</div>
          </div>
          <div class="flex items-center gap-3 text-gray-500 flex-shrink-0">
            ${treesLabel ? `<span class="whitespace-nowrap">${treesLabel}</span>` : ''}
            <span class="whitespace-nowrap">${p.hectares.toLocaleString(LOCALE)} ${T('ha')}</span>
          </div>
        </div>
      `;
    }).join('');
  }
}

// Populate carbon block
function populateCarbon(data) {
  const c = data.carbon;
  animateValue(document.getElementById('carbon-co2'), c.co2Sequestered);
  animateValue(document.getElementById('carbon-credits'), c.creditsIssued);
  animateValue(document.getElementById('carbon-sites'), c.mrv.biodiversitySites);

  const soilEl = document.getElementById('mrv-soil');
  if (soilEl) soilEl.textContent = `${c.mrv.soilHealth.verified}/${c.mrv.soilHealth.total} verified`;

  const forestEl = document.getElementById('mrv-forest');
  if (forestEl) forestEl.textContent = `${c.mrv.forestArea.monitored} ${c.mrv.forestArea.unit} monitored`;

  const solarEl = document.getElementById('mrv-solar');
  if (solarEl) solarEl.textContent = `${c.mrv.solarEnergy.value} ${c.mrv.solarEnergy.unit}`;
}

// Populate community economy block
function populateCommunity(data) {
  const comm = data.community;
  animateValue(document.getElementById('comm-wallets'), comm.activeWallets);
  animateValue(document.getElementById('comm-transactions'), comm.localTransactions);
  animateValue(document.getElementById('comm-credit'), comm.mutualCredit, ' SRF');
  animateValue(document.getElementById('comm-exchanges'), comm.localExchanges);

  // Voucher list
  const list = document.getElementById('voucher-list');
  if (list) {
    list.innerHTML = comm.vouchers.map(v => `
      <div class="flex items-center justify-between text-xs py-1.5 border-b border-dark-600/50">
        <span class="text-gray-300">${v.settlement}</span>
        <div class="flex items-center gap-3">
          <code class="text-[0.6rem] text-accent-orange bg-orange-500/10 px-1.5 py-0.5 rounded">${v.voucher}</code>
          <span class="text-gray-500">${v.transactions} tx</span>
          <span class="text-gray-600">${v.members} users</span>
        </div>
      </div>
    `).join('');
  }
}

// Populate energy solar nodes list
function populateEnergyNodes(data) {
  const list = document.getElementById('energy-node-list');
  if (!list) return;

  list.innerHTML = data.energy.nodes.map(n => {
    const walletDisplay = n.walletFull
      ? `<a href="${n.explorerUrl}" target="_blank" class="text-accent-green hover:underline">${n.wallet}</a>`
      : `<span class="text-gray-500">${n.wallet}</span>`;
    const statusDot = n.live
      ? '<span class="w-1.5 h-1.5 rounded-full bg-accent-green flex-shrink-0" title="' + T('Live data') + '"></span>'
      : '<span class="w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0" title="' + T('Mock data') + '"></span>';
    const kwhBadge = n.kwh
      ? `<span class="text-emerald-400 font-mono">${n.kwh.toLocaleString(LOCALE)} ${T('kWh')}</span>`
      : '<span class="text-gray-600 font-mono" title="' + T('No readings reported yet') + '">' + T('no data yet') + '</span>';
    const tokensBadge = n.tokens
      ? `<span class="text-yellow-400 font-mono">${n.tokens.toLocaleString(LOCALE)} AKRE</span>`
      : '<span class="text-gray-600 font-mono">—</span>';
    // Phones: name with the wallet underneath on the left, kWh over AKRE on the right
    return `
      <div class="flex items-center justify-between gap-3 text-xs py-1.5 border-b border-dark-600/50">
        <div class="flex items-center gap-2 min-w-0">
          ${statusDot}
          <div class="min-w-0">
            <span class="block truncate text-gray-300">${T(n.name)}</span>
            <span class="block text-[0.65rem] sm:hidden">${walletDisplay}</span>
          </div>
        </div>
        <div class="flex flex-col items-end gap-0.5 whitespace-nowrap sm:flex-row sm:items-center sm:gap-3">
          <span class="hidden sm:inline">${walletDisplay}</span>
          ${kwhBadge}
          ${tokensBadge}
        </div>
      </div>
    `;
  }).join('');
}

// Populate community pool list (compact)
function populateCommunityPools(data) {
  const list = document.getElementById('voucher-list');
  if (!list) return;

  list.innerHTML = data.community.vouchers.map(v => {
    const nameEl = v.url
      ? `<a href="${v.url}" target="_blank" class="text-gray-300 hover:text-accent-orange hover:underline">${T(v.settlement)}</a>`
      : `<span class="text-gray-300">${T(v.settlement)}</span>`;
    const statusDot = v.live
      ? '<span class="w-1.5 h-1.5 rounded-full bg-accent-green flex-shrink-0" title="Live data"></span>'
      : '<span class="w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0"></span>';
    return `
      <div class="flex items-center justify-between text-xs py-1.5 border-b border-dark-600/50">
        <div class="flex items-center gap-2 min-w-0">
          ${statusDot}
          ${nameEl}
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
          <code class="text-[0.6rem] text-accent-orange bg-orange-500/10 px-1.5 py-0.5 rounded">${T(v.voucher)}</code>
          <span class="text-gray-500">${T('{n} tx', { n: v.transactions })}</span>
          <span class="text-gray-600">${T('{n} users', { n: v.members })}</span>
        </div>
      </div>
    `;
  }).join('');
}

// Populate settlement vouchers list (from Sarafu reports) — paged with dots instead of an inner scroll
const SETTLEMENTS_PER_PAGE = 8;
let settlementPage = 0;

function populateSettlements(data) {
  const list = document.getElementById('settlement-list');
  if (!list || !data.sarafuReports) return;

  const all = data.sarafuReports.settlements;
  const pages = Math.max(1, Math.ceil(all.length / SETTLEMENTS_PER_PAGE));
  settlementPage = Math.min(settlementPage, pages - 1);
  const slice = all.slice(settlementPage * SETTLEMENTS_PER_PAGE, (settlementPage + 1) * SETTLEMENTS_PER_PAGE);

  list.innerHTML = slice.map(s => {
    const reportsBadge = s.reports > 0
      ? `<span class="text-accent-orange font-mono">${T('{n} reports', { n: s.reports })}</span>`
      : '<span class="text-gray-600 font-mono">' + T('{n} reports', { n: 0 }) + '</span>';
    return `
      <div class="flex items-center justify-between text-xs py-1.5 border-b border-dark-600/50">
        <div class="flex items-center gap-2 min-w-0">
          <span class="w-1.5 h-1.5 rounded-full ${s.reports > 0 ? 'bg-accent-orange' : 'bg-gray-600'} flex-shrink-0"></span>
          <a href="${s.url}" target="_blank" class="text-gray-300 hover:text-accent-orange hover:underline truncate">${T(s.name)}</a>
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
          <code class="text-[0.6rem] text-gray-500 bg-dark-700 px-1.5 py-0.5 rounded">${s.address.slice(0, 6)}...${s.address.slice(-4)}</code>
          ${reportsBadge}
        </div>
      </div>
    `;
  }).join('');

  // Keep the height of a full page so the card doesn't jump when the last page is shorter
  if (settlementPage === 0 || !list.dataset.pageHeight) list.dataset.pageHeight = String(list.offsetHeight);
  list.style.minHeight = list.dataset.pageHeight + 'px';

  const dots = document.getElementById('settlement-dots');
  if (dots) {
    dots.innerHTML = pages > 1
      ? Array.from({ length: pages }, (_, i) =>
          `<button type="button" class="pager-dot${i === settlementPage ? ' pager-dot-on' : ''}" data-page="${i}" aria-label="${T('Page {n} of {total}', { n: i + 1, total: pages })}" aria-current="${i === settlementPage}"></button>`
        ).join('')
      : '';
    dots.onclick = (e) => {
      const b = e.target.closest('.pager-dot');
      if (!b) return;
      settlementPage = Number(b.dataset.page);
      populateSettlements(data);
    };
  }
}

// Populate Hypercerts as two cards with metrics
function populateHypercerts(data) {
  const list = document.getElementById('hypercerts-list');
  if (!list || !data.hypercerts) return;

  list.innerHTML = data.hypercerts.certs.map(c => {
    const m = c.metrics || {};
    let metricsHtml = '';
    if (m.hectares) metricsHtml += `<span class="text-emerald-400">${m.hectares} ${T('ha')}</span>`;
    if (m.trees) metricsHtml += `<span class="text-green-400">${T('{n}+ trees', { n: m.trees.toLocaleString(LOCALE) })}</span>`;
    if (m.waterSystems) metricsHtml += `<span class="text-blue-400">${T('{n} water systems', { n: m.waterSystems })}</span>`;
    if (m.wellsDrilled) metricsHtml += `<span class="text-cyan-400">${T('{n} wells', { n: m.wellsDrilled })}</span>`;
    if (m.lakesRestored) metricsHtml += `<span class="text-teal-400">${T('{n} lakes restored', { n: m.lakesRestored })}</span>`;
    if (m.waterStorageLiters) metricsHtml += `<span class="text-blue-300">${T('{n}k L storage', { n: (m.waterStorageLiters/1000).toFixed(0) })}</span>`;
    if (m.livestockSecured) metricsHtml += `<span class="text-amber-400">${T('{n}+ livestock', { n: m.livestockSecured })}</span>`;
    if (m.ecovillages) metricsHtml += `<span class="text-gray-400">${T('{n} ecovillages', { n: m.ecovillages })}</span>`;

    return `
      <div class="bg-dark-700/50 border border-dark-600 rounded-lg p-3">
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-accent-green flex-shrink-0 mt-0.5"></span>
            <a href="${c.url}" target="_blank" class="text-sm text-gray-200 hover:text-accent-green hover:underline leading-tight">${T(c.title)}</a>
          </div>
          <code class="text-[0.6rem] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex-shrink-0 ml-2">${T(c.claimType)}</code>
        </div>
        <div class="flex flex-wrap gap-x-3 gap-y-1 text-[0.65rem] font-mono">${metricsHtml}</div>
      </div>
    `;
  }).join('') + `
    <div class="text-[0.65rem] text-gray-500 mt-1">${T('Total on-chain claims: {n}', { n: data.hypercerts.totalClaims })}</div>
  `;
}

// Total raised = Giveth donations + eco-credit sales (INAT revenue, USDC ≈ US$)
function renderFundingTotal(data) {
  const donations = (data.fundraising && data.fundraising.totalRaised) || 0;
  const credits = (data.inat && data.inat.totalRevenue) || 0;
  const raisedEl = document.getElementById('giveth-raised');
  if (raisedEl) raisedEl.textContent = '$' + Math.round(donations + credits).toLocaleString(LOCALE);
  const note = document.getElementById('giveth-raised-note');
  if (note) {
    note.textContent = credits > 0
      ? T('donations {a} · credit sales {b}', { a: '$' + Math.round(donations).toLocaleString(LOCALE), b: '$' + Math.round(credits).toLocaleString(LOCALE) })
      : '';
  }
}

// Populate INAT Eco-Credits
function populateInat(data) {
  if (!data.inat) return;

  const inat = data.inat;
  animateValue(document.getElementById('inat-credits-sold'), Math.round(inat.totalCreditsSold || 0));
  animateValue(document.getElementById('inat-projects'), inat.projects.length);

  const usdcEl = document.getElementById('inat-usdc');
  if (usdcEl) usdcEl.textContent = '$' + (inat.totalRevenue || 0).toFixed(2);
  if (data.fundraising) renderFundingTotal(data);

  const list = document.getElementById('inat-project-list');
  if (!list) return;

  list.innerHTML = inat.projects.map(p => {
    const credits = p.totalCredits || 0;
    const revenue = p.revenue || 0;
    const statsBadge = credits > 0
      ? `<span class="text-accent-green font-mono whitespace-nowrap">${T('{n} credits', { n: credits % 1 === 0 ? credits : credits.toFixed(2) })} · $${revenue.toFixed(2)}</span>`
      : '<span class="text-gray-600 font-mono">' + T('no sales') + '</span>';
    const projectUrl = p.url || '#';
    return `
      <div class="flex items-center justify-between text-xs py-1.5 border-b border-dark-600/50 gap-4">
        <div class="flex items-center gap-2 min-w-0">
          <span class="w-1.5 h-1.5 rounded-full bg-accent-blue flex-shrink-0"></span>
          <a href="${projectUrl}" target="_blank" class="text-gray-300 truncate hover:text-accent-blue hover:underline">${T(p.name)}</a>
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
          ${statsBadge}
        </div>
      </div>
    `;
  }).join('');
}

// Populate Fundraising & Grants
function populateFundraising(data) {
  if (!data.fundraising) return;
  const f = data.fundraising;

  renderFundingTotal(data);
  const gSum = document.getElementById('giveth-sum');
  if (gSum) gSum.textContent = '$' + Math.round(f.totalRaised).toLocaleString(LOCALE);

  animateValue(document.getElementById('giveth-donors'), f.totalDonors);
  animateValue(document.getElementById('giveth-projects'), f.totalProjects);

  const givEl = document.getElementById('giveth-giv');
  if (givEl) givEl.textContent = Math.round(f.givDistributed).toLocaleString(LOCALE);

  // Giveth project list
  const list = document.getElementById('giveth-project-list');
  if (list) {
    list.innerHTML = f.projects.map(p => `
      <div class="flex items-center justify-between text-xs py-1.5 border-b border-dark-600/50">
        <div class="flex items-center gap-2 min-w-0">
          <span class="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
          <a href="${p.url}" target="_blank" class="text-gray-300 hover:text-purple-400 hover:underline truncate">${p.name}</a>
        </div>
        <span class="text-emerald-400 font-mono flex-shrink-0 ml-2">$${Math.round(p.raised).toLocaleString(LOCALE)}</span>
      </div>
    `).join('');
  }

  // Karma card
  const karma = document.getElementById('karma-card');
  if (karma) {
    karma.innerHTML = `
      <div class="flex items-start gap-3">
        <span class="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 text-sm">K</span>
        <div>
          <a href="${f.karma.url}" target="_blank" class="text-sm text-gray-200 hover:text-pink-400 hover:underline font-medium">${T(f.karma.name)}</a>
          <p class="text-xs text-gray-500 mt-1">${T(f.karma.description)}</p>
          <a href="${f.karma.url}" target="_blank" class="inline-block mt-2 text-[0.65rem] text-pink-400 bg-pink-500/10 px-2 py-1 rounded hover:bg-pink-500/20">${T('View on Karma →')}</a>
        </div>
      </div>
    `;
  }
}

// Escape text from external APIs before putting it into innerHTML
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Karma projects are often titled with an application code (APP-XXXX); fall back to the start of the description
function karmaTitle(p) {
  if (p.title && !/^APP-/i.test(p.title)) return p.title;
  const text = (p.description || '').replace(/\s+/g, ' ').trim();
  if (!text) return p.title || '—';
  if (text.length <= 64) return text;
  return text.slice(0, 64).replace(/\s+\S*$/, '') + '…';
}

// Karma card with live data: counts, the most active projects, and a low-key link to the full list
function renderKarma(data) {
  const live = data.karmaLive;
  const el = document.getElementById('karma-card');
  if (!live || !el) return;

  const sumEl = document.getElementById('karma-sum');
  if (sumEl) sumEl.textContent = T('{n} projects', { n: live.totalProjects });

  // Prefer projects that have a real title; untitled ones (APP-XXXX codes) stay reachable via "View all"
  const titled = live.projects.filter(x => !/^APP-/i.test(x.title));
  const shown = [...(titled.length >= 3 ? titled : live.projects)]
    .sort((a, b) =>
      (b.updates - a.updates) ||
      ((/^APP-/i.test(a.title) ? 1 : 0) - (/^APP-/i.test(b.title) ? 1 : 0)) ||
      String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, 6);

  const rows = shown.map(p => `
    <div class="flex items-center justify-between gap-3 text-xs py-1.5 border-b border-dark-600/50">
      <div class="flex items-center gap-2 min-w-0">
        <span class="w-1.5 h-1.5 rounded-full bg-pink-400 flex-shrink-0"></span>
        <a href="https://www.karmahq.org/project/${encodeURIComponent(p.slug)}" target="_blank" rel="noopener" class="text-gray-300 truncate hover:text-pink-400 hover:underline">${esc(karmaTitle(p))}</a>
      </div>
      ${p.updates > 0 ? `<span class="text-gray-500 flex-shrink-0">${T('{n} updates', { n: p.updates })}</span>` : ''}
    </div>
  `).join('');

  const program = live.programs[0]
    ? `<p class="text-xs text-gray-500 mb-1">${esc(T(live.programs[0]))} · ${T('{n} updates', { n: live.totalUpdates })}</p>`
    : '';

  el.className = '';
  el.innerHTML = `
    ${program}
    <div>${rows}</div>
    <a href="https://www.karmahq.org/community/gen-ukraine-community/projects" target="_blank" rel="noopener" class="inline-block mt-2 text-[0.65rem] text-gray-500 hover:text-pink-400">${T('View all {n} projects on Karma →', { n: live.totalProjects })}</a>
  `;
}

// Bird monitoring card (BirdWeather) — stays hidden until the data arrives
function populateBirds(data) {
  const sec = document.getElementById('block-birds');
  const b = data.birds;
  if (!sec || !b) return;
  sec.classList.remove('hidden');

  const set = (id, v) => animateValue(document.getElementById(id), v);
  set('bird-stations', b.stations.length);
  set('bird-detections', b.totalDetections);
  set('bird-species', b.totalSpecies);

  const list = document.getElementById('bird-station-list');
  if (!list) return;
  const when = iso => new Date(iso).toLocaleString(LOCALE, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  list.innerHTML = b.stations.map(s => `
    <div class="bg-dark-700/50 border border-dark-600 rounded-lg p-3">
      <div class="flex items-start justify-between gap-2">
        <a href="https://app.birdweather.com/stations/${s.id}" target="_blank" rel="noopener" class="text-sm text-gray-200 hover:text-sky-400 hover:underline font-medium">${esc(T(s.name))}</a>
        <span class="w-1.5 h-1.5 mt-1.5 rounded-full flex-shrink-0 ${s.live ? 'bg-accent-green' : 'bg-gray-600'}" title="${esc(s.live ? T('Station online') : T('Station offline'))}"></span>
      </div>
      <div class="flex gap-4 mt-2 text-xs">
        <span class="font-mono text-sky-300">${T('{n} detections', { n: s.detections.toLocaleString(LOCALE) })}</span>
        <span class="font-mono text-gray-400">${T('{n} species', { n: s.speciesCount })}</span>
      </div>
      <div class="text-[0.65rem] text-gray-500 mt-1.5">${s.lastAt ? T('Last heard {when}', { when: when(s.lastAt) }) : ''}${s.approx ? ' · ' + T('approximate location') : ''}</div>
      <div class="flex flex-wrap gap-1.5 mt-2">
        ${s.top.map(t => `<span class="text-[0.65rem] text-gray-300 bg-dark-600/60 rounded-full px-2 py-0.5" title="${esc(t.sci)}">${esc(t.name)} <span class="text-gray-500">${t.count.toLocaleString(LOCALE)}</span></span>`).join('')}
      </div>
    </div>
  `).join('');
}

// Update "last updated" timestamp
function updateTimestamp(isLive) {
  const el = document.getElementById('last-updated');
  if (!el) return;
  const now = new Date();
  const formatted = now.toLocaleDateString(LOCALE, { month: 'short', year: 'numeric', day: 'numeric' });
  const time = now.toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' });
  el.textContent = isLive ? T('Live: {when}', { when: `${formatted}, ${time}` }) : T('Demo — mock data');
}

// Update footer label
function updateFooterLabel(isLive) {
  const el = document.getElementById('footer-label');
  if (!el) return;
  el.textContent = isLive
    ? T('Live blockchain data · GEN Ukraine © {year}', { year: new Date().getFullYear() })
    : T('Demo version — mock data · GEN Ukraine © 2026');
}

// === Init everything ===
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Show mock data immediately for fast first paint
  populateSummary(MOCK_DATA);
  populateEnergy(MOCK_DATA);
  populateEnergyNodes(MOCK_DATA);
  populateEcology(MOCK_DATA);
  populateCarbon(MOCK_DATA);
  populateCommunity(MOCK_DATA);
  // (energy chart is drawn once live data arrives — a mock chart would flash wrong numbers first)
  // A map failure (e.g. zero-size container → NaN LatLng) must not abort the rest of init
  try { initMap(MOCK_DATA); } catch (err) { console.warn('[App] Map init failed:', err); }

  // 2. Render static data that doesn't need API (Giveth/Karma)
  if (typeof fetchGivethKarmaData === 'function') {
    MOCK_DATA.fundraising = fetchGivethKarmaData();
    populateFundraising(MOCK_DATA);
  }

  // 3. Fetch live blockchain data and update progressively
  if (typeof fetchAllLiveData === 'function') {
    try {
      const liveData = await fetchAllLiveData(MOCK_DATA);
      // Re-populate blocks that received live data
      populateEnergy(liveData);
      populateEnergyNodes(liveData);
      populateCommunity(liveData);
      populateCommunityPools(liveData);
      populateHypercerts(liveData);
      populateInat(liveData);
      // Draw the energy chart (monthly generation, or the daily fallback)
      initEnergyChart(liveData);
      if (liveData.energy.dailyRewards) {
        const daily = liveData.energy.dailyRewards;
        const titleEl = document.getElementById('energy-chart-title');
        if (titleEl && daily.length > 0 && !liveData.energy.monthlyGeneration) {
          const fmt = s => new Date(s).toLocaleDateString(LOCALE, { month: 'short', day: 'numeric' });
          titleEl.textContent = `Daily AKRE Rewards (${fmt(daily[0].date)} – ${fmt(daily[daily.length - 1].date)})`;
        }
      }
      // Show data freshness if loaded from static snapshot
      if (liveData.energy.fetchedAt) {
        const nodesLabel = document.getElementById('energy-nodes-label');
        if (nodesLabel) {
          const d = new Date(liveData.energy.fetchedAt);
          const fmt = d.toLocaleDateString(LOCALE, { month: 'short', day: 'numeric', year: 'numeric' });
          nodesLabel.textContent = T('Solar Sites · data as of {date}', { date: fmt });
          nodesLabel.title = '';
        }
      }
      if (liveData.fundraising) populateFundraising(liveData);
      renderKarma(liveData);
      populateBirds(liveData);
      if (window.refreshBirdMarkers) window.refreshBirdMarkers(liveData);
      populateEcology(liveData);
      if (window.refreshSilviMarkers) window.refreshSilviMarkers(liveData);
      if (liveData.sarafuReports) {
        initSarafuReportsChart(liveData);
        populateSettlements(liveData);
      }
      renderLocations(liveData);
      updateTimestamp(true);
      updateFooterLabel(true);
    } catch (err) {
      console.warn('[App] Live data fetch failed, keeping mock data:', err);
      initEnergyChart(MOCK_DATA);
      renderLocations(MOCK_DATA);
      updateTimestamp(false);
    }
  }
});


// === Hint tooltips (ⓘ) — one floating tip, clamped to the viewport; hover, focus or tap ===
(function initHints() {
  let tip = null;
  function hide() { if (tip) { tip.remove(); tip = null; } }
  function show(el) {
    const text = el.getAttribute('data-tip');
    if (!text) return;
    hide();
    tip = document.createElement('div');
    tip.className = 'hint-tip';
    tip.setAttribute('role', 'tooltip');
    tip.textContent = text;
    document.body.appendChild(tip);
    const r = el.getBoundingClientRect();
    const w = tip.offsetWidth, h = tip.offsetHeight;
    const left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2));
    const top = r.top - h - 8 >= 8 ? r.top - h - 8 : r.bottom + 8;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }
  const hintOf = (e) => e.target.closest && e.target.closest('.hint[data-tip]');
  document.addEventListener('mouseover', (e) => { const h = hintOf(e); if (h) show(h); });
  document.addEventListener('mouseout', (e) => { if (hintOf(e)) hide(); });
  document.addEventListener('focusin', (e) => { const h = hintOf(e); if (h) show(h); });
  document.addEventListener('focusout', (e) => { if (hintOf(e)) hide(); });
  document.addEventListener('click', (e) => { const h = hintOf(e); if (h) show(h); else hide(); });
  window.addEventListener('scroll', hide, { passive: true });
})();
