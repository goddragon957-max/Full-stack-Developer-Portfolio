# Corrective Goal — Put the Portfolio Inside the Game

## User correction

The user rejected the previous result because it was still a portfolio page wearing a pixel-art skin.

Verbatim correction:

- "포트폴리오에 게임을 넣는게 아니라 게임에 포트폴리오를 녹이라고"

## Correct interpretation

Build a **playable cozy farming RPG mini-game** first. The portfolio must be discovered inside the game through mechanics:

- walk around a top-down farming village;
- talk/interact with buildings, NPCs, boards, crops, mailbox;
- receive portfolio information as quests, item descriptions, dialogue, job board notes, harvest rewards, and journal entries;
- do not show a conventional portfolio landing layout as the main structure.

## Must change from previous commit

The previous `cozy-pixel-farm-portfolio` pass is not enough because it is:

- header + map + side information panel;
- landmark buttons as navigation;
- portfolio info visibly structured like a website.

Replace it with:

- a game viewport/HUD/dialogue box layout;
- actual tile/step movement with `WASD`/arrow keys;
- interaction key `E`/`Space`;
- overlay dialogue/menu state;
- nearby object detection;
- visible player position state;
- portfolio facts unlocked through game interactions.

## Asset usage

Use the generated pixel-art asset sheet at:

`public/assets/cozy-farming-village-tileset-4x3.png`

It must be used as part of the game asset pipeline, not only as a reference thumbnail. Acceptable:

- extract/crop transparent sprite props from it into `public/assets/game-sprites/`;
- display extracted generated sprites in the map for buildings/props/crops;
- combine generated sprites with CSS pixel tiles and character sprites.

## Core game slice

Implement in React/CSS without adding a heavy engine unless needed.

Required game objects:

1. Player farmer/developer sprite.
2. Farmhouse spawn.
3. Workshop or blacksmith NPC/object for skills.
4. Market stall for projects.
5. Barn/server shed for backend/infra.
6. Community board for experience/quests.
7. Mailbox/contact.
8. Crop patch that can be harvested at least once.

Required mechanics:

- `WASD`/arrow key tile movement changes `data-player-x` and `data-player-y`.
- `E` or `Space` interacts with the nearest object in range.
- Interactions open a bottom dialogue box, not a permanent side portfolio card.
- Interactions unlock portfolio journal entries and quest progress.
- At least one crop/object interaction changes inventory/progress count.
- Buttons may exist only as game controls, not as section navigation.

Required public markers:

- `data-ui-pass="portfolio-inside-farming-rpg"`
- `data-game-world="playable-cozy-farm-rpg"`
- `data-player-x`
- `data-player-y`
- `data-nearby-object`
- `data-active-dialogue`
- `data-journal-count`
- `data-harvest-count`
- `PortfolioFarmGame`
- `game-sprites`
- `Press E`
- `speech-bubble-layer`
- `settings-window`
- `mini-map`
- source nouns: Java, Spring Boot, React, TypeScript, PostgreSQL, MyBatis, AWS, Linux, AWP, BIM, xeokit, XKT

Forbidden as the main UX:

- portfolio landing hero/header as the main structure;
- side panel that always reveals portfolio sections;
- landmark buttons as primary navigation;
- static map-only portfolio;
- copying Stardew Valley assets/UI/names/text.

## Verification

Commands:

```bash
npm run test
npm run lint
npm run build
```

Browser smoke:

- page loads with no JS errors;
- root has `data-ui-pass="portfolio-inside-farming-rpg"`;
- pressing Arrow/WASD changes `data-player-x` or `data-player-y`;
- moving near Market/Board/Workshop changes `data-nearby-object`;
- pressing `E` opens dialogue and increases journal count or quest progress;
- pressing `Space` near crop increases `data-harvest-count`;
- first screenshot reads as a playable cozy 2D farming RPG scene, not a website portfolio.

## Commit policy

Commit locally after verification. Do not push.
