# Home Page Spec

## Layout
- Top Row
  - Left: "Top Rookie Prospects" panel (chips + table + radar + 4 stat cards + sparkline + Prev/Next).
  - Right: "Career Length Analytics" panel with Sunburst (Plotly) OR the two embeds (SYOP Column + Gauges).
- Middle: Four embeds in a 2×2 grid.
- Bottom: "Hit Rate by Round" infographic (full width).

## Styling & Theme
- Use `/design/tokens.json` for theming; keep neon-dark aesthetic per reference screenshots.
- Panels use rounded corners, soft shadows, inner borders, and consistent paddings.

## Accessibility & Responsiveness
- Keyboard focus styles on chips/buttons.
- Works at 1440×900, 1280×800; collapses to 1-column under ~1024–1200px.
