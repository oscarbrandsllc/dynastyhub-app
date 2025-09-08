async function init() {
  const [prospects, embeds] = await Promise.all([
    fetch('../data/prospects.json').then(r => r.json()),
    fetch('../data/embeds.json').then(r => r.json())
  ]);

  const chipsContainer = document.getElementById('player-chips');
  let current = 0;

  function renderChips() {
    chipsContainer.innerHTML = '';
    prospects.forEach((player, idx) => {
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.textContent = player.name;
      chip.addEventListener('click', () => {
        current = idx;
        update();
      });
      chipsContainer.appendChild(chip);
    });
  }

  function update() {
    [...chipsContainer.children].forEach((chip, idx) => {
      chip.classList.toggle('active', idx === current);
    });

    const player = prospects[current];

    const tableContainer = document.getElementById('mini-table');
    tableContainer.innerHTML = '';
    const table = document.createElement('table');
    const row = document.createElement('tr');
    Object.values(player.table[0]).forEach(html => {
      const td = document.createElement('td');
      td.innerHTML = html;
      row.appendChild(td);
    });
    table.appendChild(row);
    tableContainer.appendChild(table);

    Plotly.react('radar', player.radar.data, player.radar.layout);
    Plotly.react('sparkline', player.sparkline.data, player.sparkline.layout);

    document.getElementById('stat-production').textContent = format(player.stats.production);
    document.getElementById('stat-efficiency').textContent = format(player.stats.efficiency);
    document.getElementById('stat-metric3').textContent = format(player.stats.metric3);
    document.getElementById('stat-athleticism').textContent = format(player.stats.athleticism);
    document.getElementById('stat-metric3-title').textContent = player.metric3LabelFull;
  }

  function format(num) {
    return num.toFixed(1) + '%';
  }

  document.getElementById('prev').addEventListener('click', () => {
    current = (current - 1 + prospects.length) % prospects.length;
    update();
  });

  document.getElementById('next').addEventListener('click', () => {
    current = (current + 1) % prospects.length;
    update();
  });

  document.getElementById('embed-syop').src = embeds.SYOP_COLUMN_CHART;
  document.getElementById('embed-gauges').src = embeds.POSITION_AVERAGE_GAUGES;
  document.getElementById('embed-ownership').src = embeds.CHAMPIONSHIP_OWNERSHIP_BAR;
  document.getElementById('embed-top60').src = embeds.TOP60_POSITIONAL_DISTRIBUTION_LINE;
  document.getElementById('embed-flex').src = embeds.FLEX_TOP20_SCATTER;
  document.getElementById('embed-ppr').src = embeds.ALL_POS_PPR_SCATTER;
  document.getElementById('embed-hit-rate').src = embeds.HIT_RATE_BY_ROUND_INFOGRAPHIC;

  renderChips();
  update();
}

init();
