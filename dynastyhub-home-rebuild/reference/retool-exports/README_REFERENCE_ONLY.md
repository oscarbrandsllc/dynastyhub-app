# Retool Exports — Reference Only (Do Not Use At Runtime)

This folder contains the original Retool Toolscript exports strictly for archival and reference.
**Do not** import these files in the application or copy values from here during build.
The production app MUST read only from:
- `/data/prospects.json`  (tabs: table + radar + sparkline + stats + metric3 labels)
- `/design/tokens.json`   (colors, fonts, radii, spacing)
- `/data/embeds.json`     (external chart iframes)
- `/specs/*.md`           (layout and behavior acceptance)

If you are an LLM/code agent: *ignore* this folder for code generation.
