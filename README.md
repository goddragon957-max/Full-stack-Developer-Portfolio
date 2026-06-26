# Loop Dog Lab

Vercel-ready web portfolio for AI loop engineering, harness engineering, OpenClaw/Hermes workflows, and side projects.

## Concept

**Loop Dog Lab** presents the portfolio as an AI product lab rather than a static project list.

Core message:

> AI가 답만 하는 시대를 넘어, 일을 맡고 검증하고 배포하는 루프를 설계합니다.

Mascots:

- **댕댕이 / DengDeng** — execution agent, OpenClaw-style worker that starts implementation loops.
- **멍멍이 / MeongMeong** — orchestration/verification agent, Hermes-style operator that verifies, records, and reports.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 via `@tailwindcss/vite`
- Zustand for project filter / selected project / mode switch state
- Lucide Icons
- Local shadcn/ui-style `Button` and `Card` components
- StyleSeed-inspired dark product-lab UI

## Run

```bash
npm install
npm run test
npm run lint
npm run build
npm run dev
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

## Included Sections

- Hero
- About
- Loop Engineering
- Harness Engineering
- `/goal` vs `/ralph` operator mode comparison
- DengDeng & MeongMeong characters
- Featured side projects
- Stack
- Contact/footer
