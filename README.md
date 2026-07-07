# 엄신용 Full-stack Portfolio

Cozy 2D pixel farming village portfolio built with Vite, React, TypeScript, Tailwind CSS, and plain CSS pixel-art shapes.

## Current Version

The first screen is **Cozy Pixel Farming Portfolio**:

- a readable pixel village map is the primary navigation;
- a small developer/farmer character stands at the active landmark;
- six landmark buttons open portfolio sections;
- the side panel shows practical career evidence, not generic marketing copy;
- the generated `cozy-farming-village-tileset-4x3.png` appears as a small reference/art detail.

## Landmarks

- `FARMHOUSE` - Home / Developer Farm introduction
- `WORKSHOP` - Skills
- `MARKET` - Projects
- `BARN` - Backend & Infra
- `COMMUNITY BOARD` - Experience
- `MAILBOX` - Contact

## Content Rule

This site is source-grounded. Public copy comes from the resume extraction and approved planning docs:

- `docs/content-map.md`
- `docs/copy/hero.md`
- `DESIGN.md`

Do not fill empty space with invented marketing copy. Private/sensitive resume data is excluded by default.

## Public Facts Represented

- Java/Spring Boot backend work
- React/TypeScript frontend work
- PostgreSQL/MyBatis database work
- AWS and Linux operation context
- AWP business systems
- BIM viewer validation with xeokit and XKT

## Controls

- Click a landmark button to change the active portfolio zone.
- `ArrowRight`, `ArrowDown`, `D`, or `S` moves to the next zone.
- `ArrowLeft`, `ArrowUp`, `A`, or `W` moves to the previous zone.
- The root exposes `data-active-zone` and `data-player-zone` for browser smoke checks.

## Stack

- Vite + React + TypeScript
- CSS/SVG-free DOM pixel art for this pass
- Tailwind CSS v4 via `@tailwindcss/vite`
- Zustand and Lucide remain available for future UI work

## Run

```bash
npm install
npm run test
npm run lint
npm run build
npm run preview -- --host 0.0.0.0 --port 4192 --strictPort
```

## Verification Focus

A pass requires more than a build. Verify that:

- the root has `data-ui-pass="cozy-pixel-farm-portfolio"`;
- the root has `data-game-world="cozy-farming-village"`;
- all six landmark buttons render;
- clicking `MARKET` changes `data-active-zone` to `market`;
- pressing `ArrowRight` or `D` changes active/player zone state;
- the first screenshot reads as a cozy 2D pixel portfolio village.
