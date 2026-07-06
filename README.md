# 엄신용 Full-stack Portfolio

Cyberpunk interactive 3D developer portfolio built with Vite, React, TypeScript, Three.js, Tailwind CSS, and Zustand.

## Current version

The first screen is **Cyberpunk Dev City**:

- drive a neon hover rover through a dark developer city;
- explore hologram portfolio districts;
- Neon Stack Garage shows the main technologies;
- Career Mainframe summarizes work history;
- BIM Grid Yard highlights AWP/BIM/3D viewer experience;
- Signal Gate points to portfolio destinations;
- HUD and mini map update as the rover moves.

This direction intentionally avoids depending on paid 3D vehicle models. The professional look comes from cyberpunk art direction: dark composition, neon lighting, city silhouettes, hologram signage, material contrast, and compact HUD design.

## Content rule

This site is source-grounded. Public copy comes from `060703.pdf` resume extraction and the approved planning docs:

- `docs/content-map.md`
- `docs/copy/hero.md`
- `DESIGN.md`

Do not fill empty space with invented marketing copy. Private/sensitive resume data is excluded by default: phone number, personal address, salary, military details, and full resume tables.

## Public facts represented

- Java/Spring Boot backend work
- React/TypeScript frontend work
- PHP/CodeIgniter maintenance roots
- PostgreSQL/MyBatis, Linux, AWS operation context
- 문자 발송 서버, 앱 API/관리자 페이지, 쇼핑몰 유지보수
- AWP business systems and 3D/BIM viewer validation
- xeokit, XKT, Three.js

## Controls

- `WASD` or arrow keys: drive
- `Space`: brake
- On touch devices: on-screen control pad
- Top landmark links jump the rover to each portfolio district

## Stack

- Vite + React + TypeScript
- Three.js for the playable 3D world
- Tailwind CSS v4 via `@tailwindcss/vite`
- Zustand remains available for stateful UI work
- Lucide Icons remain available for future UI overlays

## Run

```bash
npm install
npm run test
npm run lint
npm run build
npm run preview -- --host 0.0.0.0 --port 4190 --strictPort
```

## Verification focus

A pass requires more than a build. Verify that:

- the Three.js canvas renders;
- rover movement changes `data-car-x` / `data-car-z`;
- clicking a landmark changes `data-active-zone`;
- browser console has zero fatal JavaScript errors;
- first screenshot reads as cyberpunk 3D portfolio, not a bright toy Three.js demo.
