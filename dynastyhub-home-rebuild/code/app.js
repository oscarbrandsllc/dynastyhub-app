async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

function pct(v) {
  if (v == null) return '—';
  const n = Number(v);
  return Number.isFinite(n) ? `${n.toFixed(1)}%` : v;
}

function statCard(title, value) {
  return `<div class="stat-card"><div class="stat-title">${title}</div><div class="stat-value">${pct(value)}</div></div>`;
}

function renderTable(el, data) {
  if (!data || !data.length) {
    el.innerHTML = '<div class="empty">No table data</div>';
    return;
  }
  const row = data[0];
  const order = ["POS", "NFL", "AGE", "HT", "WT", "FILM GRADE", "OVR GRADE"];
  el.innerHTML = `<div class="mini-table">${order.map(k => `<div class="cell">${row[k] || ''}</div>`).join('')}</div>`;
}

async function renderPlot(id, payload) {
  if (payload && payload.data && payload.layout) {
    await Plotly.newPlot(id, payload.data, payload.layout, { displayModeBar: false, responsive: true });
  } else {
    const el = document.getElementById(id);
    el.innerHTML = '<div class="empty">No chart data</div>';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const [prospects, embeds] = await Promise.all([
    loadJSON('../data/prospects.json'),
    loadJSON('../data/embeds.json')
  ]);

  const iframeIds = {
    SYOP_COLUMN_CHART: 'embedSyop',
    POSITION_AVERAGE_GAUGES: 'embedGauges',
    CHAMPIONSHIP_OWNERSHIP_BAR: 'embedChampionship',
    TOP60_POSITIONAL_DISTRIBUTION_LINE: 'embedTop60',
    FLEX_TOP20_SCATTER: 'embedFlex',
    ALL_POS_PPR_SCATTER: 'embedAllPos',
    HIT_RATE_BY_ROUND_INFOGRAPHIC: 'embedHitRate'
  };
  Object.entries(iframeIds).forEach(([key, id]) => {
    if (embeds[key]) document.getElementById(id).src = embeds[key];
  });

  let index = 0;
  const chipsEl = document.getElementById('chips');
  const tableEl = document.getElementById('miniTable');
  const statsEl = document.getElementById('statsRow');

  function renderChips() {
    chipsEl.innerHTML = prospects.map((p, i) => `<button class="chip ${i === index ? 'active' : ''}" data-index="${i}">${p.name}</button>`).join('');
    chipsEl.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        index = Number(btn.dataset.index);
        update();
      });
    });
  }

  function renderStats(player) {
    const s = player.stats || {};
    const label3 = player.metric3LabelFull || (player.metric3Label === 'RRG' ? 'ROUTE RUNNING GRADE' : 'ELUSIVENESS GRADE');
    statsEl.innerHTML = [
      statCard('PRODUCTION GRADE', s.production),
      statCard('EFFICIENCY GRADE', s.efficiency),
      statCard(label3, s.metric3),
      statCard('ATHLETICISM GRADE', s.athleticism)
    ].join('');
  }

  async function update() {
    const player = prospects[index];
    renderChips();
    renderTable(tableEl, player.table);
    renderStats(player);
    await renderPlot('radar', player.radar);
    await renderPlot('spark', player.sparkline);
  }

  document.getElementById('prevBtn').addEventListener('click', () => {
    index = (index - 1 + prospects.length) % prospects.length;
    update();
  });
  document.getElementById('nextBtn').addEventListener('click', () => {
    index = (index + 1) % prospects.length;
    update();
  });

  update();
});
