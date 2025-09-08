
import Plotly from 'https://cdn.skypack.dev/plotly.js-dist-min';

const $ = (q) => document.querySelector(q);


function pct(v){ if(v==null||v===undefined) return '—'; const n = Number(v); return Number.isFinite(n)? `${n.toFixed(1)}%` : v; }
function statCard(title, value){
  return `<div class="stat-card"><div class="stat-icon">📈</div><div class="stat-meta"><div class="stat-title">${title}</div><div class="stat-value">${pct(value)}</div></div></div>`;
}
function renderStats(el, player){
  const s = player.stats || {};
  const label3 = player.metric3LabelFull || (player.metric3Label === 'RRG' ? 'ROUTE RUNNING GRADE' : 'ELUSIVENESS GRADE');
  el.innerHTML = [
    statCard('PRODUCTION GRADE', s.production),
    statCard('EFFICIENCY GRADE', s.efficiency),
    statCard(label3, s.metric3 ?? s.elusiveness),
    statCard('ATHLETICISM GRADE', s.athleticism)
  ].join('');
}

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

function html(strings, ...vals) {
  return strings.reduce((acc, s, i) => acc + s + (vals[i] ?? ''), '');
}

function renderChips(el, players, currentId, onSelect) {
  el.innerHTML = players.map(p => html`
    <button data-id="${p.id}" class="chip ${p.id===currentId ? 'active' : ''}">${p.name.split(' ')[0]}</button>
  `).join('');
  el.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => onSelect(btn.dataset.id);
  });
}

function renderTable(el, rows) {
  if (!rows || !rows.length) { el.innerHTML = '<div class="empty">No table data</div>'; return; }
  const r = rows[0]; // single-row mini table
  const order = ["POS","NFL","AGE","HT","WT","FILM GRADE","OVR GRADE"];
  el.innerHTML = html`<div class="mini-table">
    ${order.map(k => html`<div class="cell" data-k="${k}">${r[k] ?? ''}</div>`).join('')}
  </div>`;
}

async function renderPlot(elId, payload) {
  if (payload && payload.data && payload.layout) {
    await Plotly.newPlot(elId, payload.data, payload.layout, {displayModeBar:false, responsive:true});
  } else {
    const el = document.getElementById(elId);
    el.innerHTML = '<div class="todo">TODO: add Plotly JSON for this player</div>';
  }
}

async function mount() {
  const app = $('#app');
  app.innerHTML = html`
    <div class="row">
      <div class="panel left">
        <div class="panel-header"><h2>Top Rookie Prospects</h2></div>
        <div class="chips" id="chips"></div>
        <div class="mini-grid">
          <div id="miniTable"></div>
          <div id="radar" class="chart"></div>
        </div>
        <div id="statsRow" class="stats-row"><!-- four stats later --></div>
        <div id="spark" class="chart spark"></div>
      </div>
      <div class="panel right">
        <div class="panel-header"><h2>Career Length Analytics</h2></div>
        <div id="sunburst" class="chart"></div>
      </div>
    </div>
  `;

  const [prospects, sunburst] = await Promise.all([
    loadJSON('../data/prospects.json'),
    loadJSON('../data/sunburst.plotly.json').catch(()=>null)
  ]);

  // Sunburst demo
  if (sunburst) Plotly.newPlot('sunburst', sunburst.data, sunburst.layout, {displayModeBar:false, responsive:true});

  let current = prospects[0]?.id;
  const chips = $('#chips');
  const tableEl = $('#miniTable');

  async function select(id) {
    const p = prospects.find(x => x.id === id) || prospects[0];
    current = p.id;
    renderChips(chips, prospects, current, select);
    renderTable(tableEl, p.table);
    await renderPlot('radar', p.radar);
    await renderPlot('spark', p.sparkline);
    renderStats(statsEl, p);
  }

  renderChips(chips, prospects, current, select);
  select(current);
}

mount();
