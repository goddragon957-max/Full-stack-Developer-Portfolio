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
  ∪ building rects, via `openWorld.isRegionBlocked`. All four outdoor regions now
  have a mask; `REGION_COLLISION_RECTS` holds only non-terrain collision
  (building footprints, sea reefs). Regenerate masks with
  `node scripts/build-terrain-masks.mjs` — it owns the rect terrain and the
  hand-checked organic cells and unions them into the rows.
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

## Placement audit (guards now in `test-open-world.mjs`)

Terrain masks and building moves both add blocked cells, so anything placed on the
grid can get swallowed. Covered by assertions, each verified meaningful by
temporarily blocking the cell and watching the suite fail:

- gate arrivals + spawn, connected by BFS (`de62cbe`)
- fast-travel post and its derived arrival (`3cc4125`)
- forage nodes in **every** region, not just the mine (`212fad7`)
- village prop **footprints** (every cell of w*h, not just the anchor) and NPC
  patrol waypoints (`e83f910`, widened in `2f2c48f`)
- festival NPC slots and the festival interaction spot (`9053086`)
- boat-route anchors: sea entry, sea return approach, and both boarding triggers
  being approachable from an open cell

Deliberately **not** asserted, because the assertion could never fail:

- the dock deck cells' walkability — an early return in `isRegionBlocked` forces
  it, and reaching them is already implied by the ferry reachability assert
- the coast-side landing `(6,8)` being clear — same ferry assert implies it
- the whole-collision golden fingerprint doubles as a catch-all: any change to
  masks, water, buildings or the tillable rule fails it until updated on purpose

Checked and clean, no guard added (static data, all inside the fenced ranch):
ranch animal day/night positions in `villageLife.ts`.

Bugs this audit found and fixed:

- `river-coast` fast-travel post stood in the river at `(15,13)` → `(15,14)`.
- The mailbox at `(5,6)` ended up inside the farmhouse after the buildings moved
  to y3 → `(1,6)`.
- `villageLife.ts` held a dead duplicate of the NPC position table (reachable
  only via the uncalled `getLifeNpcPosition`) that had drifted to the swallowed
  `(17,6)`. Deleted rather than repaired — `VILLAGE_NPC_PATROLS` is authoritative.

**Lesson for future layout edits:** moving a building grows/moves its footprint
and can swallow props, NPC waypoints, and festival spots that were fine before.
The guards above now fail loudly instead of letting it ship.

## Known follow-ups noticed in passing

- Collision consolidation was dropped once and then **done** (`bc60610`). The
  earlier objection assumed masks and rects would both stay live; removing the
  terrain rects instead means there is nothing to keep in sync. `collisionRects`
  on the Phaser region descriptor turned out to be assigned and never read.
  Proof of no behaviour change: a fingerprint of `isRegionBlocked` over every
  region x 32x22 cell plus the tillable set hashed identically before and after,
  and that hash is now a test.

## Gotchas worth remembering

- `git checkout -- <file>` restores with **CRLF** here, so a follow-up string
  patch written with `\n` silently stops matching. Patch line-by-line instead.
- Reverting a file with `git checkout` also throws away *uncommitted* work in it
  — that discarded the whole mask refactor once mid-verification. Commit first,
  or regenerate (the generator script made that recovery free).
- An assertion that passes is not necessarily meaningful. Two written this
  session could never fail (forced-walkable dock cells, a landing already implied
  by a reachability assert). Always inject a break and watch it fail.
