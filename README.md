# 엄신용 Full-stack Portfolio

Vercel-ready personal developer portfolio built with Vite, React, TypeScript, Three.js, Tailwind CSS, Zustand, and local shadcn-style primitives.

## Content rule

This site is source-grounded. Public copy comes from `060703.pdf` resume extraction and the approved planning docs:

- `docs/content-map.md`
- `docs/copy/hero.md`
- `DESIGN.md`

Do not fill empty space with invented marketing copy. If copy is not approved, define the section function only.

Private/sensitive resume data is excluded by default: phone number, personal address, salary, military details, and full resume tables.

## Public positioning

> Java/Spring Boot와 React/TypeScript로 웹 서비스를 개발합니다.

The portfolio presents:

- PHP/CodeIgniter maintenance roots;
- Java/Spring Boot backend work;
- Next.js/React/TypeScript frontend work;
- PostgreSQL/MyBatis, Linux, AWS operation context;
- AWP business systems and 3D/BIM viewer validation;
- AI tools only as supporting developer tools, not the main identity.

## Visual direction

Current version: Spline-inspired dark 3D landing.

- no generated hero image file;
- WebGL/Three.js tech scene on the first screen;
- Magic UI-like dark grid, glass panels, glow, and border animation;
- visible stack labels: React, Spring Boot, PostgreSQL, AWP/BIM;
- Pretendard primary font;
- short, resume-like copy.

## Included sections

- Hero / introduction
- Spline-inspired 3D stack scene
- Portfolio summary stats
- Stack detail cards
- Career evidence cards
- Capability cards
- Footer links

## Stack

- Vite + React + TypeScript
- Three.js for the 3D hero scene
- Tailwind CSS v4 via `@tailwindcss/vite`
- Zustand for capability/experience filter state
- Lucide Icons
- Local shadcn/ui-style `Button` and `Card`

## Run

```bash
npm install
npm run test
npm run lint
npm run build
npm run preview -- --host 0.0.0.0 --port 4190 --strictPort
```
