# 엄신용 Portfolio Farm Game

A playable cozy 2D farming RPG where the portfolio is discovered inside the game world.

## Current Direction

This is **not** a portfolio page with game decoration. The portfolio content is embedded in a small RPG farm:

- walk with `WASD` / arrow keys;
- hold movement keys for continuous RAF-driven walking;
- press `Enter`, `Space`, or `E` to start from the fullscreen pixel title screen;
- press `E` or `Space` near objects;
- enter the farmhouse;
- inspect portfolio objects inside the house;
- unlock journal entries as game discoveries.

## Generated Pixel Assets

All pixel-art visuals used for the game are generated image assets, not hand-drawn CSS placeholders:

- `public/assets/cozy-farming-village-tileset-4x3.png` — generated outdoor farming asset sheet
- `public/assets/generated-sheets/developer-farm-map.png` — generated single-image outside farm map, used as the fullscreen terrain layer
- `public/assets/game-sprites/` — extracted outdoor sprites from the generated asset sheet
- `public/assets/generated-sheets/farmhouse-interior-room.png` — generated complete house interior map
- `public/assets/generated-sheets/developer-farmer-character-sheet.png` — generated player character sheet
- `public/assets/generated-sprites/character/` — extracted player sprites
- `public/assets/generated-sprites/character-walk/` — normalized bottom-centered walking frames
- `public/assets/generated-sheets/developer-farmhouse-interior-sheet.png` — generated interior object sheet
- `public/assets/generated-sprites/interior/` — extracted interior props

Regenerate the outside map image after changing terrain layout or tile sprite choices:

```bash
python3 scripts/generate-map-image.py
```

## Game Structure

### Outside Farm

- Farmhouse: enter the interior
- Workshop: skill clue
- Market: project clue
- Server Barn: backend/infra clue
- Community Board: AWP/BIM quest clue
- Mailbox: contact clue
- Crop Patch: harvestable project record

### Inside Farmhouse

The generated interior room contains the portfolio objects:

- `SKILL` desk: React, TypeScript, Java, Spring Boot, PostgreSQL, MyBatis
- `QUEST` board: project work and operations
- `SERVER` shelf: AWS, Linux, backend/infra
- `BIM` blueprint table: AWP, BIM, xeokit, XKT
- `JOURNAL` shelf: experience history
- `MAIL` table: contact/link destination
- `EXIT` door: return to farm

## Controls

```text
Enter / Space / E  Start title screen
WASD / Arrow Keys  Hold to move continuously
E / Space          Interact / enter / inspect
```

## Current Game Polish

- Fullscreen `100dvh` game shell instead of a scrolling webpage.
- The game map is the primary full-screen surface.
- Top HUD and right sidebar are intentionally removed.
- Dialogue is a docked bottom bar so it does not cover the center of the map.
- A gear button opens the only utility window.
- The gear menu contains `MAP`, `ABOUT`, and `SETTINGS` tabs.
- The MAP tab shows the current scene map, player position, and interactable nodes.
- The SETTINGS tab keeps a compact map under the settings controls.
- Pixel title screen with `EOM SINYONG` typed in a dot/pixel style.
- Movement is driven by a pressed-key `requestAnimationFrame` loop, not OS key repeat.
- Player sprite changes through normalized generated walking frames while moving.

## Verification

```bash
npm run test
npm run lint
npm run build
npm run preview -- --host 0.0.0.0 --port 4193 --strictPort
```

Browser checks:

- `data-ui-pass="portfolio-inside-farming-rpg"`
- `data-game-world="playable-cozy-farm-rpg"`
- `data-current-scene` changes from `outside` to `interior` after entering farmhouse
- `data-layout-mode="full-screen-map-with-overlay-ui"`
- `data-topbar-visible="false"`
- `data-sidebar-visible="false"`
- `data-overlay-layer="dialogue-and-menu"`
- `data-dialogue-mode="bottom-bar"`
- `data-bottom-dialogue-bar="game-chat"`
- `data-settings-open`
- `data-settings-tab`
- `data-labels-visible`
- `data-hints-visible`
- `data-screen-mode="fullscreen-game-shell"`
- `data-game-phase` changes from `intro` to `playing` after start
- `data-intro-title="EOM SINYONG"`
- `data-typed-title` reaches `EOM SINYONG`
- `data-movement-mode="pressed-key-raf-loop"`
- `data-sprite-normalization="bottom-centered-transparent-canvas"`
- `data-walk-cycle="coherent-generated-frames"`
- `data-world-scale-mode="pixel-locked-fit"`
- `data-mobile-fit-mode="camera-fullscreen-safe-area"`
- `data-camera-mode="player-centered-fullscreen"`
- `data-right-rail-fallback="inactive"`
- `data-map-renderer="single-generated-map-image"`
- `data-world-map-image="developer-farm-map"`
- `data-player-walking` and `data-player-frame` change while a movement key is held
- `data-player-x` / `data-player-y` change with movement
- `data-nearby-object` detects nearby objects
- `data-active-dialogue` changes after pressing `E`
- `data-journal-count` increases after inspecting portfolio objects
- `data-harvest-count` increases after crop harvest
- `data-settings-map="below-options"` appears in SETTINGS

## Rule

Do not return to a static portfolio landing page. The portfolio belongs **inside the game loop**: movement, interaction, dialogue, journal, objects, and rooms.
