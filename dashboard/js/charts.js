// ============================================================
// GEN Ukraine Impact Dashboard — Charts (Chart.js)
// ============================================================

let energyChart = null;

// Monthly generation, stacked by station (kWh). Months before a station's meter history starts are left empty.
function initMonthlyGenerationChart(data, ctx) {
  const mg = data.energy.monthlyGeneration;
  const colors = { 'Drago': '#facc15', 'Kazkove': '#4ade80', 'Tepla Gora': '#38bdf8', 'Zhyvyi Dim': '#fb923c', 'Happy People': '#a855f6', 'SV Samara': '#f472b6' };
  const labels = mg.months.map(m => new Date(m + '-01T00:00:00Z').toLocaleDateString(LOCALE, { month: 'short', timeZone: 'UTC' }));

  const datasets = mg.sites.map(s => {
    const from = (s.historyFrom || '').slice(0, 7);
    return {
      label: T(s.name),
      data: mg.months.map(m => (from && m < from ? null : (s.monthly[m] ?? null))),
      backgroundColor: colors[s.name] || '#9ca3af',
      borderRadius: 3,
      maxBarThickness: 46,
    };
  });

  if (energyChart) energyChart.destroy();
  energyChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#9ca3af', font: { size: 10 }, boxWidth: 10 } },
        tooltip: {
          callbacks: {
            label: (item) => T(' {name}: {n} kWh', { name: item.dataset.label, n: item.parsed.y.toLocaleString(LOCALE, { maximumFractionDigits: 1 }) }),
            footer: (items) => items.length > 1 ? T('Total: {n} kWh', { n: items.reduce((s, i) => s + i.parsed.y, 0).toLocaleString(LOCALE, { maximumFractionDigits: 1 }) }) : '',
          },
        },
      },
      scales: {
        x: { stacked: true, ticks: { color: '#9ca3af', font: { size: 11 } }, grid: { display: false } },
        y: { stacked: true, beginAtZero: true, ticks: { color: '#6b7280', font: { size: 10 }, callback: (v) => v + ' ' + T('kWh') }, grid: { color: 'rgba(255,255,255,0.05)' } },
      },
    },
  });

  const title = document.getElementById('energy-chart-title');
  if (title) {
    const fmt = m => new Date(m + '-01T00:00:00Z').toLocaleDateString(LOCALE, { month: 'short', year: 'numeric', timeZone: 'UTC' });
    title.textContent = T('Monthly generation, kWh ({from} – {to})', { from: fmt(mg.months[0]), to: fmt(mg.months[mg.months.length - 1]) });
  }
  const note = document.getElementById('energy-chart-note');
  if (note) {
    note.textContent = T('Shown for {n} of {total} stations: the others report only a lifetime total to Arkreen, with no monthly breakdown.', { n: mg.sites.length, total: mg.totalSites });
  }
}

function initEnergyChart(data) {
  const ctx = document.getElementById('chart-energy');
  if (!ctx) return;
  const skeleton = document.getElementById('energy-chart-skeleton');
  if (skeleton) skeleton.remove();

  if (data.energy.monthlyGeneration) {
    initMonthlyGenerationChart(data, ctx);
    return;
  }

  // Use live daily data if available, otherwise fall back to mock monthly
  const hasLiveDaily = data.energy.dailyRewards && data.energy.dailyRewards.length > 0;

  if (hasLiveDaily) {
    const daily = data.energy.dailyRewards;
    const labels = daily.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString(LOCALE, { month: 'short', day: 'numeric' });
    });
    const values = daily.map(d => Math.round(d.akre));

    // Per-site datasets
    const minerColors = ['#facc15', '#4ade80', '#38bdf8', '#fb923c', '#a855f6', '#f472b6'];
    const miners = data.energy.minerRewardDaily || [];
    const datasets = [];

    if (miners.length > 0) {
      miners.forEach((m, i) => {
        const color = minerColors[i % minerColors.length];
        datasets.push({
          label: m.name,
          data: daily.map(d => {
            const pt = m.daily.find(p => p.date === d.date);
            return pt ? Math.round(pt.akre) : 0;
          }),
          borderColor: color,
          backgroundColor: color.replace(')', ', 0.1)').replace('rgb', 'rgba'),
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: color,
          fill: false,
          tension: 0.3,
        });
      });
    } else {
      datasets.push({
        label: 'AKRE',
        data: values,
        borderColor: '#facc15',
        backgroundColor: 'rgba(250, 204, 21, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#facc15',
        fill: true,
        tension: 0.3,
      });
    }

    if (energyChart) energyChart.destroy();
    energyChart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: miners.length > 1, labels: { color: '#9ca3af', font: { size: 10 } } },
          tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#f3f4f6',
            bodyColor: '#d1d5db',
            borderColor: '#374151',
            borderWidth: 1,
            padding: 8,
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString(LOCALE)} AKRE`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#6b7280', font: { size: 10 } },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#6b7280', font: { size: 10 }, callback: v => v.toLocaleString(LOCALE) + ' AKRE' },
            beginAtZero: true,
          }
        }
      }
    });

    // Update chart title
    const titleEl = document.getElementById('energy-chart-title');
    if (titleEl) titleEl.textContent = 'Daily Energy Production — Last 30 Days';
  } else {
    // Fallback: mock monthly data
    const labels = data.energy.monthlyProduction.map(d => {
      const [y, m] = d.month.split('-');
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return months[parseInt(m) - 1];
    });
    const values = data.energy.monthlyProduction.map(d => d.value);

    if (energyChart) energyChart.destroy();
    energyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'MWh',
          data: values,
          borderColor: '#facc15',
          backgroundColor: 'rgba(250, 204, 21, 0.1)',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#facc15',
          pointBorderColor: '#facc15',
          fill: true,
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#f3f4f6',
            bodyColor: '#d1d5db',
            borderColor: '#374151',
            borderWidth: 1,
            padding: 8,
            callbacks: {
              label: (ctx) => `${ctx.parsed.y} MWh`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#6b7280', font: { size: 10 } },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#6b7280', font: { size: 10 }, callback: v => v + ' MWh' },
            beginAtZero: true,
          }
        }
      }
    });
  }
}

function initEcoCertificatesChart(data) {
  const ctx = document.getElementById('chart-eco');
  if (!ctx) return;

  const certs = data.ecology.certificates;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Regen Network', 'GainForest', 'iNaturalist'],
      datasets: [{
        data: [certs.regenNetwork, certs.gainForest, certs.iNaturalist],
        backgroundColor: ['#4ade80', '#fb923c', '#38bdf8'],
        borderColor: '#111827',
        borderWidth: 3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#f3f4f6',
          bodyColor: '#d1d5db',
          borderColor: '#374151',
          borderWidth: 1,
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.parsed}%`
          }
        }
      }
    }
  });

  // Render custom legend
  const legend = document.getElementById('eco-legend');
  if (legend) {
    const items = [
      { label: 'Regen Network', value: certs.regenNetwork, color: '#4ade80' },
      { label: 'GainForest', value: certs.gainForest, color: '#fb923c' },
      { label: 'iNaturalist', value: certs.iNaturalist, color: '#38bdf8' },
    ];
    legend.innerHTML = items.map(item => `
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:${item.color}"></span>
        <span class="text-gray-300">${item.label}</span>
        <span class="text-gray-500 ml-1">${item.value}%</span>
      </div>
    `).join('');
  }
}

// --- Sarafu Reports by Tag — Pie Chart ---

const SARAFU_TAG_COLORS = [
  '#a855f6', '#4ade80', '#22c55e', '#ec4899', '#38bdf8',
  '#f472b6', '#fb923c', '#facc15', '#a3e635', '#2dd4bf',
  '#f87171', '#818cf8', '#c084fc', '#fbbf24', '#34d399',
  '#e879f9', '#60a5fa', '#f97316', '#84cc16', '#14b8a6',
];

let sarafuReportsChart = null;

function initSarafuReportsChart(data) {
  const ctx = document.getElementById('chart-sarafu-reports');
  if (!ctx || !data.sarafuReports) return;

  const tags = data.sarafuReports.tags;
  // Show top 10 tags, group the rest as "Other"
  const topTags = tags.slice(0, 10);
  const otherCount = tags.slice(10).reduce((sum, t) => sum + t.count, 0);
  if (otherCount > 0) {
    topTags.push({ tag: 'Other', count: otherCount });
  }

  const labels = topTags.map(t => T(t.tag));
  const values = topTags.map(t => t.count);
  const colors = topTags.map((_, i) => SARAFU_TAG_COLORS[i % SARAFU_TAG_COLORS.length]);

  if (sarafuReportsChart) {
    sarafuReportsChart.destroy();
  }

  sarafuReportsChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderColor: '#111827',
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#f3f4f6',
          bodyColor: '#d1d5db',
          borderColor: '#374151',
          borderWidth: 1,
          padding: 8,
          callbacks: {
            label: (ctx) => T('{label}: {n} reports', { label: ctx.label, n: ctx.parsed }),
          },
        },
      },
    },
  });

  // Render custom legend
  const legend = document.getElementById('sarafu-reports-legend');
  if (legend) {
    legend.innerHTML = topTags.map((t, i) => `
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:${colors[i]}"></span>
          <span class="text-gray-300 text-xs">${T(t.tag)}</span>
        </div>
        <span class="text-gray-500 text-xs bg-dark-700 rounded-full px-2 py-0.5">${t.count}</span>
      </div>
    `).join('');
  }

  // Update total reports metric
  const totalEl = document.getElementById('comm-reports');
  if (totalEl) {
    animateValue(totalEl, data.sarafuReports.totalReports);
  }
  const vouchersEl = document.getElementById('comm-vouchers');
  if (vouchersEl) {
    animateValue(vouchersEl, data.sarafuReports.totalVouchers);
  }
}

function initAllCharts(data) {
  initEnergyChart(data);
  // initEcoCertificatesChart removed — ecology block now uses live Hypercerts/INAT data
}
