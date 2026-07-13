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
- The gear menu contains MAP, JOURNAL, and SETTINGS.
- Mobile uses the same world and systems with touch movement and an `E` action button.

## Domain Boundaries

- `src/game/farmLoop.ts`: crops, plots, tools, quality, and farm persistence
- `src/game/villageLife.ts`: NPC schedules, animals, products, and dates
- `src/game/fishingLoop.ts`: fishing spots, fish pools, and collection
- `src/game/openWorld.ts`: world graph, collisions, exits, travel, and region persistence
- `src/game/foragingLoop.ts`: forage and mining nodes
- `src/game/interiorWorld.ts`: building-to-interior mapping, room collisions, and interior persistence
- `src/game/audioSystem.ts`: music selection, volume, mute, and crossfade

## Constraints

- Preserve existing save keys for backward compatibility.
- Do not add a new runtime dependency for game logic or visuals.
- Do not copy commercial farming RPG or RPG Maker assets.
- Do not expand the outdoor map resolution or right rail width.
