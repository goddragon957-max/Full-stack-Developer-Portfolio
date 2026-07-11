# VERIFY.md — Portfolio Farm Game

## Commands

```bash
npm run test
npm run lint
npm run build
python scripts/clean-sprite-mattes.py --check
npm run preview -- --host 0.0.0.0 --port 4193 --strictPort
```

## Static smoke expectations

`npm run test` must verify:

- `PortfolioFarmGame` is the mounted game component.
- `PixelPortfolioVillage`, `PortfolioGame3D`, generated hero images, and cyberpunk/3D markers are absent from public UI.
- Required markers exist:
  - `data-ui-pass="portfolio-inside-farming-rpg"`
  - `data-game-world="playable-cozy-farm-rpg"`
  - `data-screen-mode="fullscreen-game-shell"`
  - `data-mobile-fit-mode="camera-fullscreen-safe-area"`
  - `data-camera-mode="player-centered-fullscreen"`
  - `data-map-grid="32x22"`
  - `data-collision-mode="entity-bounds"`
  - `data-depth-sorting="y-axis-feet"`
  - `data-right-inventory-bar="persistent"`
  - `data-map-renderer="single-generated-map-image"`
  - `data-world-map-image="developer-farm-map"`
  - `data-layout-mode="full-screen-map-with-right-inventory-bar"`
  - `data-topbar-visible="false"`
  - `data-sidebar-visible="true"`
  - `data-overlay-layer="dialogue-and-menu"`
  - `data-dialogue-mode="bottom-bar"`
  - `data-bottom-dialogue-bar="game-chat"`
  - `data-settings-open`
  - `data-settings-tab`
  - `data-inventory-open`
  - `data-inventory-count`
  - `data-selected-inventory-item`
  - `data-inventory-panel="right-game-bar"`
  - `data-inventory-slot`
  - `data-player-status="inventory-rail"`
  - `data-item-pickup`
  - `data-item-pickup-visible`
  - `data-item-pickup-toast="inventory-unlock"`
  - `data-labels-visible`
  - `data-hints-visible`
  - `data-game-phase`
  - `data-intro-title`
  - `data-typed-title`
  - `data-movement-mode="pressed-key-raf-loop"`
  - `data-player-facing`
  - `data-player-walking`
  - `data-player-frame`
  - `data-current-scene`
  - `data-player-x`
  - `data-player-y`
  - `data-nearby-object`
  - `data-active-dialogue`
  - `data-dialogue-open`
  - `data-label-display-mode="nearby-only-default"`
  - `data-quest-stage`
  - `data-quest-objective`
  - `data-journal-count`
  - `data-harvest-count`
  - `data-farm-loop="v1"`
  - `data-farm-storage-key="portfolio-farm-loop-v1"`
  - `data-farm-plot-count="6"`
  - `data-selected-farm-tool`
  - `data-selected-seed`
  - `data-farm-ready-count`
  - `data-farm-harvest-total`
  - `data-farm-first-harvest`
  - `data-farm-plot-id`
  - `data-farm-stage`
  - `data-farm-crop`
  - `data-farm-toolbelt="three-tools"`
  - `data-reset-farm="farm-state-only"`
  - `data-generated-assets="codex-image-sheets-and-game-sprites"`
- Generated asset files exist:
  - generated outdoor map image
  - outdoor generated sheet
  - extracted outdoor sprites
  - generated farmhouse interior room
  - generated character sheet
  - extracted character sprites
  - PixelLab grass-to-path and grass-to-soil flat Wang tilesets plus metadata
- Runtime image sizes are `512x352` for the outdoor map and `384x256` for the farmhouse interior.
- PixelLab runtime terrain sheets are each `64x64`, containing 16 logical `16x16` corner combinations.
- Farm Loop manifest declares exactly three crops, five crop sprite stages, three tools, and `32x32` logical assets.
- Every PNG under `public/assets/farm-loop/ground`, `tools`, and `crops` is exactly `32x32`.

## Browser play checks

Open the strict-port preview and verify in the browser:

1. Initial scene is fullscreen title phase: `data-game-phase="intro"`.
2. The title screen shows pixel/dot-style `EOM SINYONG` typing and a `START GAME` button.
3. Pressing `Enter`, `Space`, or `E` changes `data-game-phase` to `playing` and removes `.intro-screen`.
4. The game shell fills the screen with no top status bar; the map and bottom dialogue reserve space for a persistent right inventory bar.
5. With no active conversation, the bottom dialogue bar is a compact quest/objective strip; interacting expands it without floating over the map center.
6. The gear button opens the settings/menu window.
7. The gear window has `MAP`, `ABOUT`, and `SETTINGS` tabs.
8. Inventory remains visible as a full-height right game bar and never covers the map or bottom dialogue area.
9. Inventory renders exactly 12 stable slots, exposes a selected-item detail area, starts with the field journal unlocked, and shows the generated farmer portrait with the current scene.
10. Quest progress adds the quest note, development tools, harvested project crops, server log, and completion badge. Each new item ID auto-selects and briefly shows `ITEM ACQUIRED`; quantity-only updates do not replay it.
11. The MAP tab renders a mini-map with player marker and interactable object nodes.
12. SETTINGS renders object-label and Press-E toggles, then a compact map under those controls with `data-settings-map="below-options"`.
13. Player uses generated character sprite, not CSS body parts.
14. Holding a movement key changes `data-player-x` / `data-player-y` repeatedly without relying on OS key-repeat ticks.
15. Buildings and props block movement, and the player renders behind or in front of outdoor sprites according to foot position.
16. While holding movement, `data-player-walking="true"`, `data-player-frame` changes, and `data-player-sprite` changes across normalized generated walking frames.
17. The player starts beside the mailbox; pressing `E` advances `data-quest-stage` through workshop, three crop harvests, server barn, and community board completion.
18. Pressing `E` near farmhouse changes `data-current-scene` to `interior`.
19. The interior scene displays `farmhouse-interior-room.png` as the actual room background.
20. Interior hotspots exist for `SKILL`, `QUEST`, `SERVER`, `BIM`, `JOURNAL`, `MAIL`, and `EXIT`.
21. Moving near an interior object changes `data-nearby-object`.
22. Pressing `E` near `SKILL` or another interior object changes `data-active-dialogue` and increases `data-journal-count`.
23. Dialogue text exposes portfolio content through the object, not through a permanent portfolio section panel.
24. Browser console has zero fatal JavaScript errors.
25. On a narrow mobile viewport around `390x844`, the game uses a cropped player-centered camera rather than shrinking the entire map, the bottom dialogue bar stays docked, and mobile touch controls are hidden during intro / visible during play.
26. On mobile play state, the world uses player-centered camera positioning instead of shrinking the whole map to fit; movement should change the world camera `left/top` while keeping `overflowX=0`.
27. The outside scene uses `developer-farm-map.png` as one terrain image layer; the old brown/red tile-world border and empty viewport margins are not visible.
28. The central patch renders exactly six independent plots and each exposes `data-farm-stage` and `data-farm-crop`.
29. Selecting hoe, seeds, and watering can works through both the right-rail buttons and keyboard keys `1`, `2`, and `3`; selected states are visually distinct.
30. Invalid actions keep the plot unchanged and display a short Korean game message explaining the required previous action.
31. A real cycle completes as `untilled -> tilled -> planted -> watered -> growing-1 -> growing-2 -> ready -> tilled` using nearby `E` interactions.
32. Frontend, Backend, and BIM selections use distinct crop colors and all five crop sprite files per crop family.
33. Harvesting inserts the matching crop into the right inventory, selects it, reuses `ITEM ACQUIRED`, and unlocks only grounded portfolio technology text.
34. Reloading preserves plot stage/crop, selected tool/seed, crop quantities, and first-harvest state.
35. `RESET FARM` returns all six plots to `untilled`, clears crop inventory and first-harvest state, and leaves the quest stage unchanged; the reset persists after reload.
36. At `1440x900` and `390x844`, body horizontal overflow is zero and the inventory rail does not overlap the map, dialogue, or mobile touch controls.
37. At `390x844`, all three farm tool buttons and all three seed-type buttons remain touch-accessible without scrolling the inventory rail.

## Visual QA gate

The first useful screenshot should read as:

- a playable cozy pixel-art farming RPG;
- generated pixel assets, not hand-made CSS placeholders;
- the map/world occupying the whole screen;
- a bottom dialogue bar plus map, About, and Settings appearing as game overlays;
- a small gear button over the map plus a full-height right inventory HUD;
- no top website/header bar or website-style portfolio navigation rail.

Hard fail if the result looks like a portfolio page with a decorative game map.
