# 엄신용 Full-stack Portfolio

Vercel-ready personal developer portfolio built with Vite, React, TypeScript, Tailwind CSS, Zustand, local shadcn-style primitives, and a clean Gianluca Patti / Lapa-inspired illustrated visual direction.

## Content Rule

This site is source-grounded. Public copy comes from `060703.pdf` resume extraction and the approved planning docs:

- `docs/content-map.md`
- `docs/copy/hero.md`
- `DESIGN.md`

Do not fill empty space with invented marketing copy. If copy is not approved, define the section function only.

Private/sensitive resume data is excluded by default: phone number, personal address, salary, military details, and full resume tables.

## Public Positioning

> 운영 웹을 이해하고 확장하는 풀스택 개발자입니다.

The portfolio presents:

- PHP/CodeIgniter maintenance roots;
- Java/Spring Boot, Next.js/React, TypeScript full-stack growth;
- screen/API/DB/server/deployment flow understanding;
- AWP business systems and 3D/BIM viewer validation;
- AI-assisted development workflow using GPT, Cursor, Codex, OpenCode, AGENTS.md, Skills, MCP, and subagent/workflow patterns.

## Visual Direction

The current version is a clean readable illustrated portfolio:

- Pretendard primary font;
- warm paper background;
- dark brown ink;
- lavender/sand accents;
- hand-drawn line-art hero illustration;
- thick outlined rounded intro card;
- simple uppercase nav and round pills;
- generous spacing, no glow-heavy clutter.

## Included Sections

- Hero / introduction
- Portfolio summary stats
- Core capabilities
- Career evidence cards
- AI-assisted workflow
- Functional skill groups
- Footer links

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 via `@tailwindcss/vite`
- Zustand for capability/experience filter state
- Lucide Icons
- Local shadcn/ui-style `Button` and `Card`
- Local SVG illustration component: `src/components/PortfolioDoodle.tsx`

## Run

```bash
npm install
npm run test
npm run lint
npm run build
npm run preview -- --host 0.0.0.0 --port 4190 --strictPort
```

## Vercel

This project includes `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "cleanUrls": true
}
```

Deploy with Vercel after connecting the GitHub repo or by running Vercel CLI in this directory.
