# Portfolio Design Brief

## Current Direction

This portfolio is a **source-grounded full-stack developer portfolio** with a flashy Magic UI-inspired technical visual layer.

The public page should introduce 엄신용 as:

> 운영 웹을 이해하고 확장하는 풀스택 개발자입니다.

## Content Source

Use only resume-grounded and user-approved public content:

- `060703.pdf` extraction
- `docs/content-map.md`
- `docs/copy/hero.md`
- `DESIGN.md`

Do not publish private resume details: phone, address, salary, military details, or full resume tables.

## Must Communicate

- PHP/CodeIgniter maintenance roots
- Java/Spring Boot, Next.js/React, TypeScript full-stack growth
- screen/API/DB/server/deployment flow understanding
- AWP business systems and 3D/BIM viewer validation
- AI-assisted development workflow: GPT, Cursor, Codex, OpenCode, AGENTS.md, Skills, MCP, role prompts, subagent/workflow

## Visual System

Use Magic UI-style effects without depending on external package installation:

- particle field
- animated perspective grid
- border beams
- shimmer text
- glowing glass cards
- CSS/DOM 3D full-stack/BIM/AI engine hero
- dark premium technical palette: cyan, violet, muted amber accents

## Public UI Forbidden Patterns

Do not show:

- “Marketing UI rebuild”
- “귀여운 척을 빼고”
- reference-site names in the public page
- Loop Dog Lab mascot-led identity
- 댕댕이/멍멍이 character section
- invented side-project atlas above career evidence
- fake metrics

## Verification

Before completion:

```bash
npm run test
npm run lint
npm run build
```

Browser QA:

- `[data-ui-pass="magic-resume-portfolio"]`
- `[data-source="060703-resume"]`
- capability cards change `[data-active-capability]`
- experience filters change `[data-selected-experience]`
- zero console errors
- first screen reads as a flashy technical portfolio, not a generic resume and not a mascot site
