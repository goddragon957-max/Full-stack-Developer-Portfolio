# DESIGN.md — Portfolio Inside Farming RPG

## Product type

Playable cozy 2D farming RPG mini-game with portfolio content embedded into game objects.

## Critical correction

The user explicitly rejected the previous interpretation:

> 포트폴리오에 게임을 넣는게 아니라 게임에 포트폴리오를 녹이라고

Therefore the product must be a **game first**. Do not build a portfolio landing page with pixel-art styling.

## Current visual source of truth

All pixel visuals should come from Codex/OpenAI-generated pixel-art assets and extracted sprites:

- outdoor farming village asset sheet: `public/assets/cozy-farming-village-tileset-4x3.png`
- extracted outdoor sprites: `public/assets/game-sprites/`
- generated farmhouse interior room: `public/assets/generated-sheets/farmhouse-interior-room.png`
- generated character sheet: `public/assets/generated-sheets/developer-farmer-character-sheet.png`
- extracted character sprites: `public/assets/generated-sprites/character/`
- generated interior object sheet: `public/assets/generated-sheets/developer-farmhouse-interior-sheet.png`
- extracted interior props: `public/assets/generated-sprites/interior/`

CSS is allowed for layout, HUD, hotspots, and dialogue boxes, but not for fake pixel-art characters/buildings that should be generated assets.

## Game loop

1. Player moves around the farm with WASD/arrows.
2. Player presses `E`/`Space` near objects.
3. Farmhouse interaction enters the generated interior room.
4. Inside the house, portfolio content is unlocked by inspecting objects:
   - SKILL desk
   - QUEST board
   - SERVER shelf
   - BIM blueprint table
   - JOURNAL shelf
   - MAIL table
5. Dialogue and Quest Log/Journal expose the portfolio content.

## Portfolio content mapping

- Skills: React, TypeScript, Java, Spring Boot, PostgreSQL, MyBatis
- Projects: 문자 발송 서버, 앱 API/관리자 페이지, 쇼핑몰 운영, AWP 업무 시스템
- Backend/Infra: AWS, Linux, Java/Spring Boot, PostgreSQL/MyBatis
- BIM/AWP: AWP, BIM, xeokit, XKT, tile/LOD, clipping
- Experience: PHP/CodeIgniter maintenance → app/web operations → AWP/BIM systems
- Contact: GitHub, resume, project links placeholder

## Required implementation markers

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

## Avoid

- static portfolio landing hero/header as the main structure;
- side panel that simply lists portfolio sections;
- landmark buttons as primary navigation;
- hand-made CSS pixel art for major game objects;
- copied Stardew Valley assets, names, UI, characters, or text;
- 3D/cyberpunk/Bruno-style direction;
- generated art used only as a thumbnail/reference instead of actual game assets.
