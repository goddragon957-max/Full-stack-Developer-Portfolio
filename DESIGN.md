# Mossbell Farm Design

## Product

Mossbell Farm is a game-first cozy farming RPG. The first screen is the playable game, with no landing page, resume view, or site-style content panel.

## World

- Every outdoor region uses a `32x22` logical grid and a `512x352` runtime map.
- Farm Village is the hub for farming, ranching, and resident quests.
- Whisper Forest, River Coast, and Mine Foothill form a connected exploration loop.
- Visible road approaches trigger region transitions and place the player on a safe arrival tile.
- Five village buildings use independent `24x16` interiors and return the player to the correct exterior door.

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
- The gear menu contains MAP, JOURNAL, AUDIO, and RESET.
- The right rail always shows GOLD; world commerce opens as a compact in-game window without changing the rail width.
- The farmhouse shipping box accepts same-day edits and settles an itemized receipt on the next date.
- A compact season and weather strip stays below the village clock; the seven-day calendar remains inside the MAP menu.
- Harvest Night and Starlight Festival reuse the Farm Village plaza, dialogue bar, journal, inventory, and celebration layers.
- Mobile uses the same world and systems with touch movement and an `E` action button.

## Domain Boundaries

- `src/game/farmLoop.ts`: crops, plots, tools, quality, and farm persistence
- `src/game/villageLife.ts`: NPC schedules, animals, products, and dates
- `src/game/fishingLoop.ts`: fishing spots, fish pools, and collection
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

## Constraints

- Preserve existing save keys for backward compatibility.
- Do not add a new runtime dependency for game logic or visuals.
- Do not copy commercial farming RPG or RPG Maker assets.
- Do not expand the outdoor map resolution or right rail width.
- Seasonal maps preserve the same collision, building, fishing, exit, and interaction coordinates as their base region.
