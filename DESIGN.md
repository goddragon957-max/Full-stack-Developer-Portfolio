# DESIGN.md - Cozy Pixel Farming Portfolio

## Product Type

Original 2D pixel-art developer portfolio. The first screen should read as a small cozy farming village with a visible developer/farmer character, practical portfolio content, and selectable landmarks.

## Source Of Truth

Public copy stays grounded in the resume-derived project docs:

- `docs/content-map.md`
- `docs/copy/hero.md`

Use concise career evidence. Do not invent fake metrics, sentimental slogans, copied game text, or clone-specific names/assets.

## Current Direction

The portfolio is now **Cozy Pixel Farming Portfolio**.

Core idea:

- a small village/farm map acts as the navigation surface;
- each building is a portfolio landmark;
- a small developer/farmer avatar moves between selected landmarks;
- the content panel reads like a notebook/signboard, not a SaaS dashboard;
- the generated `cozy-farming-village-tileset-4x3.png` can appear as a small reference detail, while the real interface is built in React/CSS.

## Visual Language

- warm paper/cream page background;
- saturated greens, soil browns, and roof colors in blue, yellow, red, and purple;
- crisp blocky edges, hard shadows, and `image-rendering: pixelated`;
- Pretendard for body/Korean copy;
- monospace/pixel treatment only for tiny labels, buttons, badges, and controls;
- `word-break: keep-all` for readable Korean line breaks;
- no glossy 3D, dark neon identity, or cloned farming-game assets.

## Portfolio Landmarks

- `FARMHOUSE` / Home - Developer Farm introduction
- `WORKSHOP` / Skills - Java, Spring Boot, React, TypeScript, PostgreSQL, MyBatis
- `MARKET` / Projects - operations, APIs, admin pages, AWS, Linux
- `BARN` / Backend & Infra - Java, Spring Boot, AWS, Linux, PostgreSQL, MyBatis
- `COMMUNITY BOARD` / Experience - AWP, BIM, xeokit, XKT
- `MAILBOX` / Contact - portfolio/contact destination

## Interaction Contract

- clicking a landmark changes `data-active-zone`, `data-player-zone`, and the visible card content;
- arrow keys or WASD move/select the character between zones;
- landmark controls are real buttons with focus states;
- mobile becomes a vertical portfolio with the pixel village still visible above the content panel.

## Implementation Markers

- `data-ui-pass="cozy-pixel-farm-portfolio"`
- `data-game-world="cozy-farming-village"`
- `data-active-zone`
- `data-player-zone`
- `PixelPortfolioVillage`
- `cozy-farming-village-tileset-4x3.png`

## Avoid

- copying Stardew Valley assets, UI, logo, names, characters, sprites, maps, or text;
- reviving the rejected cyberpunk/3D direction;
- generated hero images as the whole experience;
- dashboard-first portfolio layouts;
- unreadable novelty fonts for main text;
- hidden decorative interactions that do not change actual state.
