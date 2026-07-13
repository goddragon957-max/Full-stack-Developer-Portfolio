# DESIGN.md — Portfolio Inside Farming RPG

## Product type

Playable cozy 2D farming RPG mini-game with portfolio content embedded into game objects.

## Critical correction

The user explicitly rejected the previous interpretation:

> 포트폴리오에 게임을 넣는게 아니라 게임에 포트폴리오를 녹이라고

Therefore the product must be a **game first**. Do not build a portfolio landing page with pixel-art styling.

## Current visual source of truth

All major runtime visuals now come from the GPT Image remaster catalog:

- source packs, prompts, hashes, frame grids, alpha results, and audio contract: `public/assets/art-remaster-v1/manifest.json`
- GPT source packs retained for reproducibility: `public/assets/art-remaster-v1/source/`
- player directional walk and action frames: `public/assets/art-remaster-v1/characters/player/`
- Lumi, Hana, Jun, Sera, and Doyun directional frames and expression portraits: `public/assets/art-remaster-v1/npcs/`
- livestock, crops, products, fish, forage, ore, tools, buildings, props, and effects: `public/assets/art-remaster-v1/`
- four final `512x352` region images and the reused OpenAI-generated farmhouse interior: `public/assets/art-remaster-v1/maps/`
- expected user-supplied music files and explicit silent-mode status: `public/assets/audio/manifest.json`

The older folders below remain as historical inputs and regression fixtures, but runtime visual modules must not reference them:

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
- Village Pulse NPC frames and manifest: `public/assets/village-pulse/`
- Fishing Pond rod, bobber, ripple, and five fish sprites: `public/assets/fishing/`
- Fishing Pond asset and world-coordinate manifest: `public/assets/fishing/manifest.json`
- Village & Farm Life v2 NPCs, livestock, products, and crop stages: `public/assets/village-life-v2/`
- Village & Farm Life v2 reproducible asset manifest: `public/assets/village-life-v2/manifest.json`
- Pixel Farm Mini Open World v1 region maps, NPCs, forage, ore, fish, tools, and manifest: `public/assets/open-world-v1/`

The final outdoor floors are GPT Image painted maps normalized to `512x352` with nearest-neighbor resampling. Code-generated blueprints are reference-only inputs under `source/maps`; they are never rendered as fallback art.

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
8. Inventory is a persistent full-height game HUD bar on the right. `BAG`, `FARM`, `RANCH`, and `FORAGE` tabs each reuse a stable 4x3 slot grid instead of extending the rail as items accumulate.
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
21. Frontend, Backend, BIM, tomato, corn, and pumpkin crops use distinct generated sprite families and a short timer after watering. The seed selector groups them into `PORTFOLIO` and `VILLAGE` sets so three touch targets remain comfortably sized.
22. Harvesting a ready plot returns it to `tilled`, adds the crop with `normal`, `silver`, or `gold` quality, and unlocks the matching collection record.
23. Farm fields, selected tool and seed, crop inventory, quality ledger, watering streak, and first-harvest state persist under `portfolio-farm-loop-v1` in `localStorage`, including migration from the v1 payload.
24. `RESET FARM` resets only the Farm Loop state and does not reset the current quest or the rest of the game world.
25. Village Pulse cycles through dawn, day, sunset, and night in a short showcase-friendly loop; one completed `AUTO` cycle advances exactly one village day. SETTINGS also exposes fixed `DAY` and `NIGHT` modes that never advance the date.
26. Lumi remains the village keeper. Farmer Hana and rancher Jun add two scheduled NPCs with phase-sensitive positions, dialogue, and daily crop or ranch requests.
27. Every harvest shows a short world-space combo pop. Only the first harvest and quest completion trigger the larger pixel-firework celebration.
28. Celebration layers stay inside the map area and never cover the permanent inventory rail or docked dialogue bar.
29. A compact stepped pond occupies unused lower-right grass without changing the `32x22` world or `512x352` runtime map resolution.
30. Pond water cells are blocked terrain. Two shoreline points expose animated ripples and nearby `E` prompts.
31. The fourth toolbelt slot and keyboard shortcut `4` select the fishing rod; farm tools remain on `1`, `2`, and `3`.
32. Fishing runs through `idle -> casting -> waiting -> bite -> success|escaped`. Early input, late input, movement, or changing tools safely reels in the line.
33. Bluegill, carp, perch, koi, and moonfin use isolated transparent `32x32` pixel PNGs. Moonfin appears only in the night pool.
34. The first catch unlocks a quantified world fish basket in the inventory. The compact catalog records pond, river, and coast species discovery and quantity; rare catches reuse the Village Pulse fireworks.
35. Only permanent fish inventory/discovery data persists under `portfolio-fishing-loop-v1`; transient cast state never persists.
36. `RESET FISHING` clears only fishing collection data and leaves Farm Loop, quest, and Village Pulse settings intact.
37. A compact fenced ranch occupies unused lower-left grass beside the barn without changing roads, pond, six plots, `32x22` map size, or `512x352` runtime resolution.
38. Three chickens and two cows use stable daytime slots and return toward the barn at night. Their explicit states are `idle`, `hungry`, `fed`, `happy`, `product-ready`, and `sleeping`.
39. Nearby `E` interactions collect a ready product first, otherwise feed an animal and then pet it. Short hearts or notes confirm care; collection shows a world-space `+1` pop.
40. Fed animals prepare eggs or milk for the next day. Unfed animals do not produce, and three consecutive perfect-care days award a deterministic rare golden egg.
41. Completing care for all five animals displays `PERFECT CARE`; golden eggs and completed NPC requests reuse the existing bounded fireworks layer.
42. Village day, animal care, affection, ready products, discovery, perfect-care streak, and daily requests persist under `portfolio-village-life-v2`.
43. `RESET RANCH` resets only livestock and ranch products while preserving the village date, Farm Loop, Fishing Pond, portfolio quest, and Village Pulse mode.
44. The first tomato, egg, milk, and golden egg use the existing `ITEM ACQUIRED` feedback and select the relevant `FARM` or `RANCH` collection entry.
45. Crop quality uses a bounded random roll with small bonuses from watering streak and current animal care; it does not alter the six-plot growth sequence.
46. NPC and animal routes use fixed collision-safe slots rather than full pathfinding, so they never overlap buildings, pond cells, plots, or the player start.
47. Animal and crop sprites are GPT Image originals processed by `scripts/process-gpt-remaster-assets.py`; no white matte, semi-transparent contamination, or external shadow is allowed.
48. Permanent state is stored; transient animation frames, walking offsets, world feedback, and fireworks are intentionally reconstructed at runtime.
49. `Farm Village`, `Whisper Forest`, `River Coast`, and `Mine Foothill` form an explicit four-region graph. Each outdoor region remains `32x22` with a `512x352` runtime map.
50. Edge exits transition without a page reload and use a short bounded pixel fade. Returning through an exit places the player near the corresponding entrance.
51. First visits display `AREA DISCOVERED`; discovering all four regions displays `WORLD EXPLORER` and unlocks every region on the world map.
52. Fast travel is available only after interacting with a region signpost and only targets directly discovered regions. Fast travel arrives beside the destination signpost.
53. Whisper Forest has exactly five daily forage nodes: mushroom, herb, wild berry, fern, and rare moon-bloom. Mine Foothill has five pickaxe nodes yielding stone, copper, iron, or rare star crystal.
54. Forage and mining nodes respawn once when the village date changes. Inventory, discovery, requests, collected nodes, current region, and player position persist independently.
55. River Coast reuses the Fishing Loop with two river and two coast points. Six new fish expand the catalog from five pond fish to eleven total species with habitat- and phase-specific pools.
56. Forest guide Sera and mine keeper Doyun are two generated scheduled NPCs. Each has phase-sensitive positions and one grounded collection request.
57. The fifth toolbelt slot and keyboard shortcut `5` select the pickaxe. Existing farm shortcuts `1`-`3` and fishing shortcut `4` remain unchanged.
58. Existing RESET FARM, RESET RANCH, and RESET FISHING actions never alter `portfolio-open-world-v1` or `portfolio-foraging-loop-v1`.

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
- `data-collision-mode="entity-and-water-bounds"`
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
- `data-farm-toolbelt="five-tools"`
- `data-reset-farm="farm-state-only"`
- `data-selected-game-tool`
- `data-fishing-loop="v1"`
- `data-fishing-storage="localStorage"`
- `data-fishing-storage-key="portfolio-fishing-loop-v1"`
- `data-fishing-water="pond"`
- `data-fishing-spot-count`
- `data-fishing-spot-total="6"`
- `data-fishing-state`
- `data-fishing-catch-total`
- `data-fishing-discovered`
- `data-fishing-pool`
- `data-fishing-feedback`
- `data-fishing-spot-id`
- `data-fishing-catalog`
- `data-reset-fishing="fishing-state-only"`
- `data-village-pulse="v1"`
- `data-time-mode`
- `data-day-phase`
- `data-village-clock`
- `data-time-mode-control="auto-day-night"`
- `data-npc-count="5"`
- `data-npc-id="village-keeper"`
- `data-npc-frame`
- `data-celebration`
- `data-fireworks-layer="milestone-celebration"`
- `data-harvest-combo`
- `data-harvest-feedback="combo-pop"`
- `data-village-life="v2"`
- `data-village-day`
- `data-village-life-storage="localStorage"`
- `data-village-life-storage-key="portfolio-village-life-v2"`
- `data-life-npc-count="2"`
- `data-life-npc-id`
- `data-life-npc-schedule`
- `data-ranch-animal-count="5"`
- `data-animal-id`
- `data-animal-species`
- `data-animal-status`
- `data-ranch-product-total`
- `data-perfect-care-streak`
- `data-reset-ranch="ranch-state-only"`
- `data-farm-growth="v2"`
- `data-farm-crop-count="6"`
- `data-crop-quality`
- `data-inventory-tab`
- `data-inventory-tab-control="bag-farm-ranch-forage"`
- `data-open-world="v1"`
- `data-current-region`
- `data-world-region-count="4"`
- `data-world-graph="explicit"`
- `data-region-transition`
- `data-region-discovered`
- `data-fast-travel`
- `data-open-world-storage-key="portfolio-open-world-v1"`
- `data-open-world-npc-count="2"`
- `data-foraging-loop="v1"`
- `data-foraging-storage-key="portfolio-foraging-loop-v1"`
- `data-forage-node-count="10"`
- `data-forage-inventory-total`
- `data-forage-quest`
- `data-mine-quest`
- `data-art-remaster="v1"`
- `data-visual-source="gpt-image"`
- `data-generated-assets="gpt-image-remaster-packs"`
- `data-animation-catalog="directional-gpt-sprites"`
- `data-player-action`
- `data-dialogue-portrait`
- `data-ambient-layer="gpt-pixel-effects"`
- `data-audio-system="region-crossfade"`
- `data-settings-map="below-options"`

## Avoid

- static portfolio landing hero/header as the main structure;
- permanently visible side panel that simply lists portfolio sections;
- landmark buttons as primary navigation;
- hand-made CSS pixel art for major game objects;
- copied Stardew Valley assets, names, UI, characters, or text;
- 3D/cyberpunk/Bruno-style direction;
- generated art used only as a thumbnail/reference instead of actual game assets.
