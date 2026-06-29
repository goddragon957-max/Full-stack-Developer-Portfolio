# Loop Dog Lab

Vercel-ready web portfolio for AI loop engineering, harness engineering, OpenClaw/Hermes workflows, and side projects.

## Concept

**Loop Dog Lab** presents the portfolio as an AI product lab rather than a static project list.

Core message:

> AI에게 일을 맡기고, 끝까지 검증되는 루프를 만듭니다.

Design direction:

- Marketing UI / personal portfolio, not dashboard UI.
- Reference mix: Rauno Freiberg card rhythm, Brittany Chiang rail structure, Paco Coursey restraint, Josh Comeau-level small playful detail.
- Mascots are small role markers, not the hero illustration.
- One signal-green accent on warm grayscale.

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

- Hero / sticky identity rail
- Design reset / marketing UI direction
- Loop Engineering
- Harness Engineering
- `/goal` vs `/ralph` operator mode comparison
- DengDeng & MeongMeong small operating-role markers
- Featured side projects with selected-project case study evidence
- Ralph completion evidence strip: Built / Verified / User-validated
- Stack
- Contact/footer
