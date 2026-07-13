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
  - `data-collision-mode="entity-and-water-bounds"`
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
  - `data-farm-toolbelt="five-tools"`
  - `data-reset-farm="farm-state-only"`
  - `data-selected-game-tool`
  - `data-fishing-loop="v1"`
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
  - `data-generated-assets="gpt-image-remaster-packs"`
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
- Village Pulse manifest declares Lumi's 16 directional frames and every NPC PNG remains on the normalized `118x181` canvas.
- Fishing Pond manifest declares five fish, two ripple frames, two fishing spots, and at least twelve blocked pond cells.
- Every fishing rod, bobber, ripple, and fish PNG remains exactly `32x32` with transparency.
- Village & Farm Life v2 manifest declares exactly two new NPCs, three chickens, two cows, three products, three new crops, and five crop stages.
- Village & Farm Life v2 NPC frames remain `48x64`; animal, product, and crop PNGs remain `32x32` with transparency.
- Open World v1 manifest declares three additional `512x352` maps, two `48x64` NPC families, five forest items, four mine items, six new fish, and `16px` logical terrain tiles.
- Every Open World v1 item, ore, fish, signpost, and pickaxe PNG remains `32x32` with transparency.

## Art & Feel Remaster v1 checks

- `python scripts/process-gpt-remaster-assets.py` regenerates 278 runtime sprites from 19 recorded GPT Image source packs.
- `python scripts/assemble-gpt-remaster-maps.py` produces four `512x352` GPT-painted outdoor maps and copies the existing OpenAI-generated `384x256` farmhouse interior into the remaster catalog.
- `public/assets/art-remaster-v1/manifest.json` records `visual_source: gpt-image`, source hashes, prompt summaries, cell coordinates, output canvases, alpha results, maps, interior, and five expected audio tracks.
- `python scripts/clean-sprite-mattes.py --check` verifies all 278 remaster outputs have binary alpha, transparent black padding, and transparent corners in addition to the 25 legacy regression sprites.
- Runtime visual modules contain no references to the old Farm Loop, Village Life, Fishing, Open World, PixelLab, generated-sprite, or game-sprite folders.
- Directional walk sprites exist for the player and all five NPCs. The player also has 15 GPT action frames for hoe, watering, pickaxe, fishing cast, and fishing reel.
- Each NPC has neutral, happy, and concerned GPT dialogue portraits. NPC dialogue selects a portrait without changing the bottom-bar height.
- Farm, forest, coast, and mine use bounded GPT effect sprites for water, smoke, flora, crystal, and night window loops. `prefers-reduced-motion` collapses those decorative loops.
- `public/assets/audio/manifest.json` records the five user-supplied source tracks, converted MP3 outputs, and SHA-256 hashes for `village-day`, `forest-day`, `coast-day`, `mine-day`, and `night`.
- `RegionAudioController` is the only playback boundary. `scripts/test-audio-system.mjs` verifies user-input unlock, region and night routing, the 1000 ms crossfade, mute, volume changes, persistence, and disposal.
- If any music file is removed later, the existing availability guard keeps the game usable in silent mode without synthesis or network downloads.

Required commands:

```powershell
npm run test
npm run lint
npm run build
python scripts/clean-sprite-mattes.py --check
```

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
19. The interior scene displays `art-remaster-v1/maps/farmhouse-interior.png` as the actual room background.
20. Interior hotspots exist for `SKILL`, `QUEST`, `SERVER`, `BIM`, `JOURNAL`, `MAIL`, and `EXIT`.
21. Moving near an interior object changes `data-nearby-object`.
22. Pressing `E` near `SKILL` or another interior object changes `data-active-dialogue` and increases `data-journal-count`.
23. Dialogue text exposes portfolio content through the object, not through a permanent portfolio section panel.
24. Browser console has zero fatal JavaScript errors.
25. On a narrow mobile viewport around `390x844`, the game uses a cropped player-centered camera rather than shrinking the entire map, the bottom dialogue bar stays docked, and mobile touch controls are hidden during intro / visible during play.
26. On mobile play state, the world uses player-centered camera positioning instead of shrinking the whole map to fit; movement should change the world camera `left/top` while keeping `overflowX=0`.
27. The outside scene uses the current region image under `art-remaster-v1/maps/` as one terrain layer; the old brown/red tile-world border and empty viewport margins are not visible.
28. The central patch renders exactly six independent plots and each exposes `data-farm-stage` and `data-farm-crop`.
29. Selecting hoe, seeds, and watering can works through both the right-rail buttons and keyboard keys `1`, `2`, and `3`; selected states are visually distinct.
30. Invalid actions keep the plot unchanged and display a short Korean game message explaining the required previous action.
31. A real cycle completes as `untilled -> tilled -> planted -> watered -> growing-1 -> growing-2 -> ready -> tilled` using nearby `E` interactions.
32. Frontend, Backend, and BIM selections use distinct crop colors and all five crop sprite files per crop family.
33. Harvesting inserts the matching crop into the right inventory, selects it, reuses `ITEM ACQUIRED`, and unlocks only grounded portfolio technology text.
34. Reloading preserves plot stage/crop, selected tool/seed, crop quantities, and first-harvest state.
35. `RESET FARM` returns all six plots to `untilled`, clears crop inventory and first-harvest state, and leaves the quest stage unchanged; the reset persists after reload.
36. At `1440x900` and `390x844`, body horizontal overflow is zero and the inventory rail does not overlap the map, dialogue, or mobile touch controls.
37. At `390x844`, all five tool buttons remain at least `44x44`; the `PORTFOLIO` / `VILLAGE` seed groups expose three comfortably sized seed buttons at a time without body horizontal scrolling.
38. Village time begins in a readable day phase, advances in `AUTO`, and switches immediately to fixed `DAY` or `NIGHT` through the SETTINGS segmented control.
39. The right inventory rail displays a compact phase clock without increasing rail `scrollHeight` or overlapping the toolbelt.
40. Lumi renders on the central road with changing `data-npc-frame`; nearby `E` sets `data-active-dialogue="villageKeeper"` and displays time-sensitive dialogue.
41. A normal harvest activates `data-harvest-feedback="combo-pop"` and increments `data-harvest-combo` within the combo window.
42. The first harvest and quest completion activate `data-fireworks-layer="milestone-celebration"`; the effect remains inside the map area and expires automatically.
43. At desktop and mobile night mode, paths, crops, player, dialogue, and inventory remain legible, horizontal overflow stays zero, and console errors remain zero.
44. The lower-right pond preserves the existing roads, six farm plots, buildings, and Lumi route; attempting to step from the west fishing stand into pond cell `24,15` leaves the player at `23,15`.
45. Both `pond-west` and `pond-south` render a ripple sprite and expose a nearby interaction prompt without overlapping each other.
46. Selecting the rod works through both toolbelt slot `4` and keyboard `Digit4`; selecting a farm tool cancels an active cast and restores farm interaction.
47. A real fishing cycle reaches `casting`, `waiting`, and `bite`, then pressing `E` inside the bite window reaches `success` and increments the pond basket.
48. Pressing `E` during `casting` or `waiting` reaches `escaped`; ignoring `bite` beyond the timing window also reaches `escaped`, and both paths return to `idle`.
49. Day pool excludes `moonfin`; night pool includes it. A deterministic night QA catch of moonfin activates `data-celebration="rare-fish"` and the existing fireworks layer.
50. The first catch displays `ITEM ACQUIRED`, adds the fish to the catalog, records its species count, and persists after a full page reload.
51. `RESET FISHING` returns all fish quantities and discoveries to zero while the serialized Farm Loop state, quest stage, and selected Village Pulse time mode remain unchanged.
52. At `390x844`, all five tool buttons are at least `44x44`, mobile E completes a catch, body horizontal overflow is zero, and the rail, map, dialogue, and touch pad have no pairwise overlap.
53. The root reports `data-npc-count="5"`: Lumi, Hana, Jun, Sera, and Doyun. Each scheduled NPC changes position with dawn/day/sunset/night without occupying collision terrain.
54. Nearby desktop or mobile `E` accepts phase-sensitive daily requests; harvesting a requested village crop makes Hana's request ready, while collecting a requested egg or milk makes Jun's request ready.
55. The lower-left ranch contains exactly three chickens and two cows. Daytime positions stay in separate stable slots; fixed night mode reports all five as `sleeping` near the barn.
56. For each animal, repeated nearby `E` interactions complete feed then pet. All five happy animals produce `PERFECT CARE`, and the next day exposes eggs or milk only for animals fed on the previous day.
57. A product-ready chicken completes egg collection and a product-ready cow completes milk collection; the first of each displays `ITEM ACQUIRED`, adds one to `RANCH`, and shows a short world-space `+1`.
58. Three consecutive perfect-care days award a golden egg, select its `RANCH` entry, and activate `data-celebration="golden-egg"` with the bounded fireworks layer.
59. Tomato, corn, and pumpkin reuse the six existing plots and full Farm Loop sequence. A deterministic QA harvest records one of `normal`, `silver`, or `gold` in the `FARM` quality ledger.
60. `BAG`, `FARM`, `RANCH`, and `FORAGE` each render the same stable 12-slot grid; switching tabs does not resize the rail and all four tabs remain touchable at `390x844`.
61. One complete `AUTO` dawn/day/sunset/night cycle increments the village day exactly once. Waiting in forced `DAY` or `NIGHT` leaves the date unchanged.
62. Reloading restores village day, each animal's care/product state, ranch products, plots, crop quantities, and quality ledger without persisting animation frames or transient feedback.
63. `RESET RANCH` clears only animal/ranch progress while preserving day, serialized Farm Loop, Fishing Pond, quest, and time mode. `RESET FARM` clears only plots/crops while preserving village-life and fishing payloads.
64. Desktop `1440x900` and mobile `390x844` have zero browser console errors, zero horizontal overflow, and no overlap among the inventory rail, map, bottom dialogue, gear menu, or mobile touch controls.
65. Regression play still completes one fishing catch, opens Lumi's phase-sensitive dialogue, performs the original portfolio crop loop, and preserves the unchanged `32x22` / `512x352` world contract.
66. Real movement completes `Farm Village -> Whisper Forest -> River Coast -> Mine Foothill -> Farm Village` through edge exits with no page reload.
67. First forest, coast, and mine visits update discovery exactly once; the fourth region activates `WORLD EXPLORER` and the existing bounded fireworks layer.
68. Sera's forest request reaches active, ready, and complete after collecting its target. Doyun's mine request does the same after a pickaxe collection.
69. A forest herb, rare moon-bloom, copper ore, and rare star crystal enter the `FORAGE` inventory; rare finds activate their short celebration feedback.
70. River fishing selects only river species and records a successful catch. The original farm pond still records a second successful catch after the world loop.
71. A signpost interaction changes `data-fast-travel` to `ready`; selecting a discovered region moves to its safe signpost arrival while undiscovered regions remain unavailable.
72. Reloading restores current region, safe player position, four discovered areas, forage inventory, node collection, NPC requests, and eleven-species fishing collection.
73. Advancing the village date repopulates all five forest nodes and five mine nodes once without changing permanent item quantities.
74. RESET FARM, RESET RANCH, and RESET FISHING leave the serialized Open World and Foraging payloads byte-for-byte unchanged.
75. Hoeing, watering, mining, casting, and reeling temporarily set `data-player-action` and cycle through three GPT action frames before returning to the directional idle sprite.
76. Talking to Lumi, Hana, Jun, Sera, or Doyun renders the matching `data-dialogue-portrait`; non-NPC object dialogue does not reserve portrait space.
77. Every region exposes `data-ambient-layer="gpt-pixel-effects"`; ambient sprites remain pointer-inert and do not affect collision or depth sorting.
78. After the first user input, SETTINGS reports the matching village, forest, coast, mine, or night track; transitions crossfade over 1000 ms, mute reaches silence, and volume values persist under `portfolio-audio-v1` after reload.
79. Pressing `E` outside every interaction range opens `emptyLook` dialogue and never reuses the first building or NPC ID for a false interaction or portrait.

## Visual QA gate

The first useful screenshot should read as:

- a playable cozy pixel-art farming RPG;
- generated pixel assets, not hand-made CSS placeholders;
- the map/world occupying the whole screen;
- a bottom dialogue bar plus map, About, and Settings appearing as game overlays;
- a small gear button over the map plus a full-height right inventory HUD;
- a readable compact ranch, four connected regions, scheduled villagers, world-map travel, crop-quality feedback, and BAG/FARM/RANCH/FORAGE tabs that still feel like part of the same game;
- no top website/header bar or website-style portfolio navigation rail.

Hard fail if the result looks like a portfolio page with a decorative game map.
