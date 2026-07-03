# Loop Dog Lab Agent Instructions

## Product Goal

Build and maintain a Vercel-ready personal developer portfolio for 엄신용. The public page must introduce the owner as a full-stack developer grounded in real resume content, using a clean Gianluca Patti / Lapa-inspired illustrated portfolio style.

## Source-Grounded Content Rules

- Source of truth: `060703.pdf` extraction plus `docs/content-map.md`, `docs/copy/hero.md`, and `DESIGN.md`.
- Public copy should introduce the person, skills, career evidence, and AI-assisted workflow.
- Do not invent filler marketing copy because a section feels empty.
- If copy is not approved, define the section function only.
- Exclude private/sensitive resume details by default: phone, address, salary, military details, and full resume tables.
- Do not make Loop Dog Lab, mascots, 댕댕이/멍멍이, or internal agent jargon the first-screen identity.
- Do not expose design-process phrases such as “Marketing UI rebuild”, reference site names, or “귀여운 척을 빼고” in public UI.

## Current Public Positioning

Headline:

> 운영 웹을 이해하고 확장하는 풀스택 개발자입니다.

Core evidence:

- PHP/CodeIgniter maintenance roots.
- Java/Spring Boot, Next.js/React, TypeScript full-stack growth.
- Screen/API/DB/server/deployment flow understanding.
- AWP business system and 3D/BIM viewer validation.
- AI-assisted development workflow using GPT, Cursor, Codex, OpenCode, AGENTS.md, Skills, MCP, role prompts, and subagent/workflow.

## Visual Direction

The current visual direction is **clean readable illustrated portfolio**, not dark Magic UI.

Use:

- Pretendard as the primary font.
- warm paper / cream background.
- dark brown ink.
- lavender and sand accent palette.
- large hand-drawn line-art hero illustration.
- thick outlined rounded intro card.
- simple uppercase navigation and round pills.
- generous spacing and readable Korean paragraphs.

Avoid:

- particles, border beams, shimmer text, aurora backgrounds, or glow-heavy dark UI as the main style.
- cramped/condensed Korean typography.
- giant negative letter spacing that makes Korean unreadable.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 through `@tailwindcss/vite`
- Zustand
- Lucide Icons
- Local shadcn/ui-style components in `src/components/ui`
- Local `PortfolioDoodle` SVG illustration

## Required Verification

Run before reporting complete:

```bash
npm run test
npm run lint
npm run build
```

Browser smoke:

- Start preview on a strict port.
- Confirm `[data-ui-pass="gianluca-clean-portfolio"]`.
- Confirm `[data-font="pretendard"]`.
- Confirm `[data-source="060703-resume"]`.
- Click a capability card and confirm `[data-active-capability]` changes.
- Click an experience category and confirm visible cards / `[data-selected-experience]` changes.
- Confirm console has zero JavaScript errors.
- Visually inspect first screen for readable Pretendard Korean, warm illustrated style, and no particle/glow clutter.
