document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded. Initializing app...');
    // --- STATE ---
    let prospectsData = [];
    let embedsData = {};
    let currentPlayerIndex = 0;

    // --- DOM ELEMENTS ---
    const chipsContainer = document.getElementById('chips-container');
    const playerInfoTable = document.getElementById('player-info-table');
    const radarChartDiv = document.getElementById('radar-chart');
    const sparklineChartDiv = document.getElementById('sparkline-chart');
    const statCardsContainer = document.getElementById('stat-cards');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    // --- DATA FETCHING ---
    async function fetchData(url) {
        console.log(`Fetching data from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for ${url}`);
        }
        const data = await response.json();
        console.log(`Successfully fetched ${url}`);
        return data;
    }

    // --- RENDERING FUNCTIONS ---

    function renderChips() {
        console.log('Rendering chips...');
        if (!chipsContainer) {
            console.error('Error: chipsContainer element not found!');
            return;
        }
        chipsContainer.innerHTML = '';
        prospectsData.forEach((player, index) => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.textContent = player.name;
            chip.dataset.index = index;
            chipsContainer.appendChild(chip);
        });
        console.log(`${prospectsData.length} chips rendered.`);
    }

    function renderIframes() {
        console.log('Rendering iframes...');
        document.getElementById('syop-chart').src = embedsData.SYOP_COLUMN_CHART;
        document.getElementById('position-average-chart').src = embedsData.POSITION_AVERAGE_GAUGES;
        document.getElementById('championship-chart').src = embedsData.CHAMPIONSHIP_OWNERSHIP_BAR;
        document.getElementById('flex-top20-chart').src = embedsData.FLEX_TOP20_SCATTER;
        document.getElementById('all-pos-ppr-chart').src = embedsData.ALL_POS_PPR_SCATTER;
        document.getElementById('hit-rate-chart').src = embedsData.HIT_RATE_BY_ROUND_INFOGRAPHIC;
        console.log('Iframes rendered.');
    }

    function updateActiveChip() {
        const chips = chipsContainer.querySelectorAll('.chip');
        chips.forEach((chip, index) => {
            if (index === currentPlayerIndex) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });
    }

    function updateTable(tableData) {
        playerInfoTable.innerHTML = '';
        if (!tableData || tableData.length === 0) return;
        const data = tableData[0];
        const row = playerInfoTable.insertRow();
        const headers = Object.keys(data);
        headers.forEach(header => {
            const cell = row.insertCell();
            cell.innerHTML = data[header];
        });
    }

    function updateRadarChart(radarData) {
        if (!radarData) return;
        const layout = { ...radarData.layout, autosize: true };
        Plotly.react(radarChartDiv, radarData.data, layout, { responsive: true, displayModeBar: false });
    }

    function updateSparklineChart(sparklineData) {
        if (!sparklineData) return;
        const layout = { ...sparklineData.layout, autosize: true };
        Plotly.react(sparklineChartDiv, sparklineData.data, layout, { responsive: true, displayModeBar: false });
    }

    function updateStatCards(stats, metric3LabelFull) {
        statCardsContainer.innerHTML = '';
        if (!stats) return;
        const statItems = [
            { label: 'PRODUCTION GRADE', value: stats.production },
            { label: 'EFFICIENCY GRADE', value: stats.efficiency },
            { label: metric3LabelFull, value: stats.metric3 },
            { label: 'ATHLETICISM GRADE', value: stats.athleticism }
        ];
        statItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            const valueDiv = document.createElement('div');
            valueDiv.className = 'value';
            valueDiv.textContent = item.value ? `${item.value.toFixed(1)}%` : 'N/A';
            const labelDiv = document.createElement('div');
            labelDiv.className = 'label';
            labelDiv.textContent = item.label;
            card.appendChild(valueDiv);
            card.appendChild(labelDiv);
            statCardsContainer.appendChild(card);
        });
    }

    function renderPlayer(player) {
        if (!player) return;
        console.log(`Rendering player: ${player.name}`);
        updateActiveChip();
        updateTable(player.table);
        updateRadarChart(player.radar);
        updateSparklineChart(player.sparkline);
        updateStatCards(player.stats, player.metric3LabelFull);
    }

    // --- EVENT HANDLERS ---

    function handleChipClick(event) {
        if (event.target.classList.contains('chip')) {
            const newIndex = parseInt(event.target.dataset.index, 10);
            if (newIndex !== currentPlayerIndex) {
                currentPlayerIndex = newIndex;
                renderPlayer(prospectsData[currentPlayerIndex]);
            }
        }
    }

    function handlePrevClick() {
        currentPlayerIndex = (currentPlayerIndex - 1 + prospectsData.length) % prospectsData.length;
        renderPlayer(prospectsData[currentPlayerIndex]);
    }

    function handleNextClick() {
        currentPlayerIndex = (currentPlayerIndex + 1) % prospectsData.length;
        renderPlayer(prospectsData[currentPlayerIndex]);
    }

    // --- INITIALIZATION ---
    async function init() {
        console.log('init() called.');
        try {
            [prospectsData, embedsData] = await Promise.all([
                fetchData('../data/prospects.json'),
                fetchData('../data/embeds.json')
            ]);

            console.log('Data fetched successfully. Prospects count:', prospectsData.length);

            renderIframes();
            renderChips();

            currentPlayerIndex = 0;
            renderPlayer(prospectsData[currentPlayerIndex]);

            chipsContainer.addEventListener('click', handleChipClick);
            prevButton.addEventListener('click', handlePrevClick);
            nextButton.addEventListener('click', handleNextClick);

        } catch (error) {
            console.error('Failed to initialize application:', error.message);
        }
    }

    init();
});
