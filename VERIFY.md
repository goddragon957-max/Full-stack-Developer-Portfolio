# VERIFY.md — Portfolio Farm Game

## Commands

```bash
npm run test
npm run lint
npm run build
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
  - `data-right-rail-fallback="inactive"`
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
  - `data-journal-count`
  - `data-harvest-count`
  - `data-generated-assets="codex-image-sheets-and-game-sprites"`
- Generated asset files exist:
  - outdoor generated sheet
  - extracted outdoor sprites
  - generated farmhouse interior room
  - generated character sheet
  - extracted character sprites

## Browser play checks

Open the strict-port preview and verify in the browser:

1. Initial scene is fullscreen title phase: `data-game-phase="intro"`.
2. The title screen shows pixel/dot-style `EOM SINYONG` typing and a `START GAME` button.
3. Pressing `Enter`, `Space`, or `E` changes `data-game-phase` to `playing` and removes `.intro-screen`.
4. Game map is the full-screen surface; there is no top status bar and no right sidebar rail.
5. Dialogue appears as a docked bottom dialogue bar with `bottom-dialogue-bar`, not as a floating speech bubble over the map center.
6. The gear button opens the settings/menu window.
7. The gear window has `MAP`, `ABOUT`, and `SETTINGS` tabs.
8. The MAP tab renders a mini-map with player marker and interactable object nodes.
9. SETTINGS renders object-label and Press-E toggles, then a compact map under those controls with `data-settings-map="below-options"`.
10. Player uses generated character sprite, not CSS body parts.
11. Holding a movement key changes `data-player-x` / `data-player-y` repeatedly without relying on OS key-repeat ticks.
12. While holding movement, `data-player-walking="true"`, `data-player-frame` changes, and `data-player-sprite` changes across normalized generated walking frames.
13. Pressing `E` near farmhouse changes `data-current-scene` to `interior`.
14. The interior scene displays `farmhouse-interior-room.png` as the actual room background.
15. Interior hotspots exist for `SKILL`, `QUEST`, `SERVER`, `BIM`, `JOURNAL`, `MAIL`, and `EXIT`.
16. Moving near an interior object changes `data-nearby-object`.
17. Pressing `E` near `SKILL` or another interior object changes `data-active-dialogue` and increases `data-journal-count`.
18. Dialogue text exposes portfolio content through the object, not through a permanent portfolio section panel.
19. Browser console has zero fatal JavaScript errors.
20. On a narrow mobile viewport around `390x844`, the game uses a cropped player-centered camera rather than shrinking the entire map, the bottom dialogue bar stays docked, and mobile touch controls are hidden during intro / visible during play.
21. On mobile play state, the world uses player-centered camera positioning instead of shrinking the whole map to fit; movement should change the world camera `left/top` while keeping `overflowX=0`.

## Visual QA gate

The first useful screenshot should read as:

- a playable cozy pixel-art farming RPG;
- generated pixel assets, not hand-made CSS placeholders;
- the map/world occupying the whole screen;
- a bottom dialogue bar plus map, About, and Settings appearing as game overlays;
- a small gear button as the only persistent utility control;
- no top website/header bar and no right sidebar rail.

Hard fail if the result looks like a portfolio page with a decorative game map.
