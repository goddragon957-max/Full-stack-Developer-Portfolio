# Mossbell Farm Design

## Product

Mossbell Farm is a game-first cozy farming RPG. The first screen is the playable game, with no landing page, resume view, or site-style content panel.

## World

- Every outdoor region uses a `32x22` logical grid and a `512x352` runtime map.
- Farm Village is the hub for farming, ranching, and resident quests.
- Whisper Forest, River Coast, and Mine Foothill form a connected exploration loop.
- Visible road approaches trigger region transitions and place the player on a safe arrival tile.
- Mine Foothill keeps its enclosed cliff terraces decorative and non-walkable; saved positions inside blocked terrain recover to the nearest main route.
- Five village buildings use independent `24x16` interiors and return the player to the correct exterior door.
- Farm Village keeps the original six plots and exposes a bounded `5x4` field where FARM MODE can add persistent plots without touching roads or buildings.

## Visual Direction

- Crisp high-detail pixel art with warm saturated colors and soft dark outlines
- Orthographic RPG perspective and consistent upper-left lighting
- Nearest-neighbor scaling and `image-rendering: pixelated`
- Transparent sprites with binary alpha, transparent RGB, and no white matte
- GPT Image source artwork for runtime visuals; scripts only crop, normalize, validate, and assemble

## Interface

- The game world remains the primary full-screen surface.
- A fixed right rail contains player status, tools, inventory tabs, and the current objective.
- Dialogue stays in a bottom bar.
- The gear menu contains MAP, CALENDAR, JOURNAL, AUDIO, SETUP, and RESET.
- MAP reuses the active GPT seasonal region art for discovered-region thumbnails and the local position preview.
- CALENDAR shows all four seasons, a deterministic seven-day forecast, festivals, and preferred crops.
- SETUP owns display and time controls; RESET contains only isolated farm, ranch, and fishing data resets.
- The right rail always shows GOLD; on wide Phaser screens it may expand into unused map gutters while commerce remains a compact in-game window.
- The farmhouse shipping box accepts same-day edits and settles an itemized receipt on the next date.
- A compact season and weather strip stays below the village clock; the full seven-day planner lives in the CALENDAR tab.
- Harvest Night and Starlight Festival reuse the Farm Village plaza, dialogue bar, journal, inventory, and celebration layers.
- MAIN STORY lives inside the existing JOURNAL, MAP, CALENDAR, dialogue, and cutscene layers rather than opening a separate page.
- Story destinations are highlighted on both the world map and local preview; short skippable cutscenes never block the right rail.
- Mobile uses the same world and systems with touch movement and an `E` action button.
- Selecting the hoe activates FARM MODE: movement toward an empty field cell targets it, and `E` tills a new persistent plot for the existing seed, water, growth, and harvest loop.
- Selecting the fishing rod activates shoreline casting: facing any valid pond, river, or coast water cell exposes one cast target without permanent fishing-zone markers.

## Domain Boundaries

- `src/game/farmLoop.ts`: crops, plots, tools, quality, and farm persistence
- `src/game/villageLife.ts`: NPC schedules, animals, products, and dates
- `src/game/fishingLoop.ts`: shoreline cast targets, water habitats, fish pools, and collection
- `src/game/openWorld.ts`: world graph, collisions, exits, travel, and region persistence
- `src/game/foragingLoop.ts`: forage and mining nodes
- `src/game/interiorWorld.ts`: building-to-interior mapping, room collisions, and interior persistence
- `src/game/audioSystem.ts`: music selection, volume, mute, and crossfade
- `src/game/economySystem.ts`: GOLD, seed and feed stock, prices, purchases, and milestones
- `src/game/shippingLoop.ts`: quality-aware shipment entries, reconciliation, receipts, and inventory deduction
- `src/game/toolProgression.ts`: two-level watering can, fishing rod, and pickaxe upgrades
- `src/game/seasonSystem.ts`: four seven-day seasons, year rollover, crop preferences, and daily demand
- `src/game/weatherSystem.ts`: deterministic daily weather, rain application, and audio mix rules
- `src/game/festivalSystem.ts`: annual festival schedule, plaza interactions, souvenirs, and journal completion
- `src/game/storySystem.ts`: action-gated chapters, seasonal seals, story destinations, dialogue, cutscenes, save migration, and ending rewards

## Constraints

- Preserve existing save keys for backward compatibility.
- Do not add a new runtime dependency for game logic or visuals.
- Do not copy commercial farming RPG or RPG Maker assets.
- Do not expand the outdoor map resolution; right-rail and dialogue chrome may adapt to absorb unused fixed-overview space.
- Seasonal maps preserve the same collision, building, fishing-water, exit, and interaction coordinates as their base region.
- The seasonal ranch enclosure uses a flat, straight-top rectangular GPT gate; the former rounded gate is removed during deterministic map assembly.
- Story progress only advances from actions performed after the relevant chapter starts; existing inventory cannot retroactively complete objectives.
- Story rewards and chapter-completion cutscenes are idempotent across refreshes and repeated interactions.
