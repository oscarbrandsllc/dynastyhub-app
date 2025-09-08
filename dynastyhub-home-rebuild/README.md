# Dynasty Hub — Home Page Rebuild (No Retool)

This repo contains everything an AI code assistant (e.g. Codex) needs to rebuild the **Home** page exactly as in the reference screenshots, using only local data plus the given embed URLs.

## Ground Truth
- See `/assets/reference/*.jpeg|*.png` for visual targets.
- A static snapshot is available at `/reference/snapshots/homepage-snapshot.html`.

## Data
- `/data/embeds.json` → Flourish/Netlify iframes.
- `/data/sunburst.plotly.json` → ready-to-plot Plotly config for the Sunburst.
- `/data/radar.jeanty.data.json` and `/data/radar.jeanty.layout.json` → Plotly radar.
- `/data/sparkline.jeanty.data.json` and `/data/sparkline.jeanty.layout.json` → Plotly sparkline.
- `/data/table.jeanty.json` → Table rows for the player chip.
- `/data/stat_cards.json` → Parsed Retool <Statistic> blocks (label + value).

## Styling
- Use `/design/tokens.json` for colors, radii, and font stacks.
- Include fonts via Google Fonts or @font-face (Orbitron, Bruno Ace, Syncopate, DM Sans/Quicksand).

## Build Tasks (for Codex)
1. Create `/src/index.html`, `/src/styles.css`, and `/src/app.js` (or React/Vite) to render the page 1:1.
2. Sidebar exists but links are inert (for now).
3. Top-left panel:
   - Player chips (start with **Jeanty** provided here).
   - Bind **table.jeanty.json** to the mini-table.
   - Render **radar.jeanty** (Plotly scatterpolar).
   - Render the **four stat cards** using `stat_cards.json` (use the values that correspond to the default view).
   - Render **sparkline** from the provided Plotly files.
   - Provide Prev/Next wiring for future players (placeholder until more data is added).
4. Top-right panel:
   - Render Sunburst from `/data/sunburst.plotly.json` **OR** leave the Flourish/Gauge iframes if you prefer (see #5).
5. Middle 2×2 and bottom-wide panels:
   - Use the six iframes listed in `/data/embeds.json`. Iframes should be responsive with rounded corners.
6. Responsiveness: match layout at 1440×900 and 1280×800; stack sensibly under ~1200px.
7. Do not invent data—if something is missing, render a clear TODO badge.

## Fonts
Recommended (in `<head>`):
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700&family=Bruno+Ace&family=Syncopate:wght@400;700&family=DM+Sans:wght@400;500;700&family=Quicksand:wght@400;500;700&display=swap" rel="stylesheet">

