# Loop Dog Lab Agent Instructions

## Product Goal

Build and maintain a Vercel-ready personal developer portfolio for 엄신용. The public page must introduce the owner as a full-stack developer grounded in real resume content, with a flashy Magic UI-inspired technical visual layer.

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

Use a flashy technical portfolio treatment inspired by Magic UI:

- particles;
- animated perspective grid;
- border-beam cards;
- shimmer text;
- cyan/violet glow;
- CSS/DOM 3D full-stack/BIM/AI engine hero.

High energy is allowed, but readability and source-grounded content win.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 through `@tailwindcss/vite`
- Zustand
- Lucide Icons
- Local shadcn/ui-style components in `src/components/ui`
- Local Magic UI-style components in `src/components/magic`

## Required Verification

Run before reporting complete:

```bash
npm run test
npm run lint
npm run build
```

Browser smoke:

- Start preview on a strict port.
- Confirm `[data-ui-pass="magic-resume-portfolio"]`.
- Confirm `[data-source="060703-resume"]`.
- Click a capability card and confirm `[data-active-capability]` changes.
- Click an experience category and confirm visible cards / `[data-selected-experience]` changes.
- Confirm console has zero JavaScript errors.
- Visually inspect the first screen for Magic UI / 3D technical portfolio feel.
