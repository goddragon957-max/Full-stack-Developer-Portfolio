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

1. Initial scene is `outside`.
2. Player uses generated character sprite, not CSS body parts.
3. Pressing movement keys changes `data-player-x` / `data-player-y`.
4. Pressing `E` near farmhouse changes `data-current-scene` to `interior`.
5. The interior scene displays `farmhouse-interior-room.png` as the actual room background.
6. Interior hotspots exist for `SKILL`, `QUEST`, `SERVER`, `BIM`, `JOURNAL`, `MAIL`, and `EXIT`.
7. Moving near an interior object changes `data-nearby-object`.
8. Pressing `E` near `SKILL` or another interior object changes `data-active-dialogue` and increases `data-journal-count`.
9. Dialogue text exposes portfolio content through the object, not through a permanent portfolio section panel.
10. Browser console has zero fatal JavaScript errors.

## Visual QA gate

The first useful screenshot should read as:

- a playable cozy pixel-art farming RPG;
- generated pixel assets, not hand-made CSS placeholders;
- a house interior where portfolio content lives in objects;
- Quest Log/Journal as game UI, not a website card layout.

Hard fail if the result looks like a portfolio page with a decorative game map.
