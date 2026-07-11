# DESIGN.md — Portfolio Inside Farming RPG

## Product type

Playable cozy 2D farming RPG mini-game with portfolio content embedded into game objects.

## Critical correction

The user explicitly rejected the previous interpretation:

> 포트폴리오에 게임을 넣는게 아니라 게임에 포트폴리오를 녹이라고

Therefore the product must be a **game first**. Do not build a portfolio landing page with pixel-art styling.

## Current visual source of truth

All pixel visuals should come from Codex/OpenAI-generated pixel-art assets and extracted sprites:

- outdoor farming village asset sheet: `public/assets/cozy-farming-village-tileset-4x3.png`
- extracted outdoor sprites: `public/assets/game-sprites/`
- generated farmhouse interior room: `public/assets/generated-sheets/farmhouse-interior-room.png`
- generated character sheet: `public/assets/generated-sheets/developer-farmer-character-sheet.png`
- extracted character sprites: `public/assets/generated-sprites/character/`
- generated interior object sheet: `public/assets/generated-sheets/developer-farmhouse-interior-sheet.png`
- extracted interior props: `public/assets/generated-sprites/interior/`
- PixelLab MCP flat Wang terrain sets: `public/assets/pixellab/terrain/grass-path-flat/` and `public/assets/pixellab/terrain/grass-soil-flat-v2/`
- Farm Loop ground, tool, and crop-stage sprites: `public/assets/farm-loop/`
- Farm Loop asset manifest: `public/assets/farm-loop/manifest.json`

The outdoor floor is assembled from PixelLab's 16x16 flat corner-based Wang metadata, then palette-matched without dithering to the existing outdoor source sheet. Keep the runtime map at `512x352`; improve detail through coherent transitions and sparse props rather than increasing the display image resolution.

CSS is allowed for layout, HUD, hotspots, and dialogue boxes, but not for fake pixel-art characters/buildings that should be generated assets.

Player walking frames are normalized into `public/assets/generated-sprites/character-walk/` on a shared bottom-centered transparent canvas. This keeps fullscreen play from exaggerating crop differences between generated frames.

## Game loop

1. Player starts at a fullscreen pixel title screen with `EOM SINYONG` typed in a dot/pixel style.
2. Player starts the game with `Enter`, `Space`, `E`, or the `START GAME` button.
3. The game world/map fills the whole viewport.
4. No top HUD/status bar or website-style portfolio navigation is allowed; normal play reserves a permanent right column for the game inventory.
5. Dialogue appears as a docked bottom dialogue bar, leaving the map center playable.
6. A gear button opens the game menu over the map area.
7. Gear window tabs: `MAP`, `ABOUT`, `SETTINGS`.
8. Inventory is a persistent full-height game HUD bar on the right. It uses a stable 4x3 slot grid and fills with quest items, harvested project records, server logs, and milestones as the player progresses.
9. The inventory bar shows the generated farmer portrait and current scene. Newly unlocked item IDs auto-select, highlight their slot, and show a short `ITEM ACQUIRED` banner; quantity-only updates do not replay the banner.
10. Player holds WASD/arrows to move through a RAF-driven input loop, not OS key repeat.
11. Outdoor exploration uses a `32x22` map with entity-bound collision and feet-based Y depth sorting.
12. Object labels are hidden by default; a compact `E` prompt appears only near an interactable object.
13. Player presses `E`/`Space` near objects.
14. The first quest starts at the mailbox and follows workshop → 3 crop harvests → server barn → community board.
15. Farmhouse interaction enters the generated interior room.
16. Inside the house, portfolio content is unlocked by inspecting objects:
   - SKILL desk
   - QUEST board
   - SERVER shelf
   - BIM blueprint table
   - JOURNAL shelf
   - MAIL table
17. The bottom dialogue bar collapses to a compact objective strip when no conversation is active.
18. The bottom dialogue bar, persistent inventory bar, and gear-menu overlays expose the portfolio content.
19. The central farm patch contains six independent `32x32` plots with the state sequence `untilled -> tilled -> planted -> watered -> growing-1 -> growing-2 -> ready`.
20. Tool slots select hoe, seeds, or watering can through pointer/touch input and keyboard shortcuts `1`, `2`, and `3`.
21. Frontend, Backend, and BIM crops use distinct generated sprite families and a short timer after watering.
22. Harvesting a ready plot returns it to `tilled`, adds the crop to the permanent inventory, and unlocks the matching portfolio record.
23. Farm fields, selected tool and seed, crop inventory, and first-harvest state persist under `portfolio-farm-loop-v1` in `localStorage`.
24. `RESET FARM` resets only the Farm Loop state and does not reset the current quest or the rest of the game world.

## Portfolio content mapping

- Skills: React, TypeScript, Java, Spring Boot, PostgreSQL, MyBatis
- Projects: 문자 발송 서버, 앱 API/관리자 페이지, 쇼핑몰 운영, AWP 업무 시스템
- Backend/Infra: AWS, Linux, Java/Spring Boot, PostgreSQL/MyBatis
- BIM/AWP: AWP, BIM, xeokit, XKT, tile/LOD, clipping
- Experience: PHP/CodeIgniter maintenance → app/web operations → AWP/BIM systems
- Contact: GitHub, resume, project links placeholder

## Required implementation markers

- `data-ui-pass="portfolio-inside-farming-rpg"`
- `data-game-world="playable-cozy-farm-rpg"`
- `data-screen-mode="fullscreen-game-shell"`
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
- `data-current-scene`
- `data-player-x`
- `data-player-y`
- `data-player-facing`
- `data-player-walking`
- `data-player-frame`
- `data-movement-mode="pressed-key-raf-loop"`
- `data-sprite-normalization="bottom-centered-transparent-canvas"`
- `data-walk-cycle="coherent-generated-frames"`
- `data-world-scale-mode="pixel-locked-fit"`
- `data-mobile-fit-mode="camera-fullscreen-safe-area"`
- `data-camera-mode="player-centered-fullscreen"`
- `data-map-grid="32x22"`
- `data-collision-mode="entity-bounds"`
- `data-depth-sorting="y-axis-feet"`
- `data-right-inventory-bar="persistent"`
- `data-map-renderer="single-generated-map-image"`
- `data-world-map-image="developer-farm-map"`
- `data-nearby-object`
- `data-active-dialogue`
- `data-dialogue-open`
- `data-label-display-mode="nearby-only-default"`
- `data-quest-stage`
- `data-quest-objective`
- `data-journal-count`
- `data-harvest-count`
- `data-farm-loop="v1"`
- `data-farm-storage="localStorage"`
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
- `data-settings-map="below-options"`

## Avoid

- static portfolio landing hero/header as the main structure;
- permanently visible side panel that simply lists portfolio sections;
- landmark buttons as primary navigation;
- hand-made CSS pixel art for major game objects;
- copied Stardew Valley assets, names, UI, characters, or text;
- 3D/cyberpunk/Bruno-style direction;
- generated art used only as a thumbnail/reference instead of actual game assets.
