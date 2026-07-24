# Mossbell Farm — next goals & status

_Last updated: 2026-07-24. Stardew-inspired browser farm RPG (React + Phaser 4.2, Vite, TS)._

## Architecture (read before starting)

- 4 outdoor regions (`farm-village` / `whisper-forest` / `river-coast` / `mine-foothill`),
  each 32×22 tiles (16px). Background = baked `seasons-v1` PNG (terrain only).
  Buildings, fences, animals, NPCs are code-placed sprites.
- Movement/collision ownership is React (`MossbellFarmGame.tsx` `movePlayer`);
  Phaser (`WorldScene`) is a render + input adapter. 1 intent = 1 tile,
  `MOVE_INTERVAL_MS = 140` (kept in sync in **both** files), sprites use
  constant-velocity interpolation (`BASE_SPRITE_SPEED_PX_PER_MS`).
- Collision = water (`WORLD_WATER_ROWS`) ∪ terrain mask (`REGION_TERRAIN_MASKS`)
  ∪ building rects, via `openWorld.isRegionBlocked`.
- Camera = fit-center (whole region always on screen, letterbox).
  `cameraController.getFitCameraZoom`.

## Status of each goal

| # | Goal | Status |
|---|------|--------|
| P1 | Movement feel | **Speed committed** (`d9b4144`, 92→140ms, ~7.1 tiles/s, tunable). Final call — keep / retune / switch to continuous pixel movement — needs a **playtest decision**. |
| P2 | Terrain masks for 3 regions | **Done for what needs it.** `farm-village` + `river-coast` (borders + standing trees, `7f19b08`) masked. `whisper-forest` / `mine-foothill` are dense, deliberately-tuned regions whose collision is locked by explicit walkable-route tests (e.g. mine `x15,y13`, forest bridge `x15,y8`); their "gaps" are intended-passable rocky/grassy ground, so blind masking is net-negative — left on existing rects. |
| P3 | Tillable mask (restrict tilling to painted fields) | **Not started — design fork.** Conflicts with the shipped freeform-farming feature (`isFarmVillageTillableTerrain` currently lets you till any open grass). Needs a decision: freeform vs restricted. |
| P4 | Letterbox centering | **Non-bug.** Phaser `clampX` centers on both axes symmetrically. No change. |
| P5 | Walk-frame ↔ distance sync | **Done** (`ee2e818`). Player snapshot carries `frames[]`; `WorldScene.advanceWalkFrame` cycles 0-1-2-1 by `WALK_STRIDE_PX` travelled, so the gait animates smoothly between one-tile snapshots. |

Long term: consider migrating to a Tiled tilemap + tileset (unlocks per-tile
seasonal swaps, layered depth, tile animation).

## How to work here (verification + gotchas)

- `npm test` (all suites must pass) / `npm run lint` = `tsc --noEmit`.
- **Terrain masks**: hand-authored, verified by eye. Loop:
  `scripts/build-coast-mask.py` (declare rects → emit rows + `scripts/_mask-coast.png`)
  or `scripts/generate-region-collision-mask.py <mapPNG> <maskFile>` → Read the
  overlay PNG to check blocked cells sit on trees/water. **Auto color-classification
  is unreliable** (grass ≈ trees in this art). `REGION_TERRAIN_MASKS` lives in
  `src/game/worldTerrain.ts`.
- **Anti-trap guard** (added `de62cbe`): `test-open-world.mjs` flood-fills each
  region so any mask that severs a gate from spawn fails the suite. Run masks
  through it.
- **Test-loader trap**: `test-open-world.mjs` / `test-world-composition.mjs`
  string-replace `openWorld.ts` imports by exact regex — if you change an import
  in `openWorld.ts`, update those regexes too.
- Browser pane must be visible for Phaser to composite (else screenshots time
  out); otherwise verify via tests, overlay PNGs, or in-page module import of
  computed values.
- Commit author auto-selects via remote-alias includeIf (`goddragon957-max`).
  Don't use `gh auth switch`.

## Known follow-ups noticed in passing

- `river-coast` fast-travel post `(15,13)` sits on a water cell (marker triggers
  from adjacent land, so not a trap — left as-is; see `de62cbe`).
- After masks mature, review removing the now-redundant `*_BLOCKED_RECTS`.
