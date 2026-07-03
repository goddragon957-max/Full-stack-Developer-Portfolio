# DESIGN.md — Loop Dog Lab Portfolio

## Product Type

Personal developer portfolio / career introduction page.

## Source of Truth

Public copy must be grounded in `060703.pdf` resume extraction and the approved docs:

- `docs/content-map.md`
- `docs/copy/hero.md`

Do not invent side-project narratives or filler marketing copy. If there is not enough copy, define the section function only.

## Public Positioning

A full-stack developer who started from PHP/CodeIgniter service maintenance and expanded into Java/Spring Boot, Next.js/React, TypeScript, database/server/deployment flows, AWP business systems, 3D/BIM viewer validation, and AI-assisted development workflows.

## Visual Direction

The user requested a flashy rebuild inspired by Magic UI and allowed 3D effects.

Use:

- Magic UI-style visual effects: particles, animated grid, border beams, shimmer text, glowing cards.
- A CSS/DOM 3D hero object representing a full-stack/AWP/BIM/AI workflow engine.
- Dark premium technical palette with electric cyan, violet, and warm amber accents.
- Strong Korean headline, concise resume-grounded body copy.
- High visual energy, but content must stay professional and readable.

Avoid:

- Exposing design-process phrases like “Marketing UI rebuild”, “귀여운 척을 빼고”, or reference-site names in public UI.
- Making Loop Dog Lab, mascots, 댕댕이/멍멍이, or internal agent jargon the first-screen identity.
- Publishing private details from the PDF: phone, personal email, address, salary, military information.
- Generic fake metrics or unrelated side-project cards above career evidence.

## Layout

1. Full-screen hero with animated background, 3D engine/cube, and resume-grounded introduction.
2. Four capability cards: full-stack, operations/maintenance, AWP/BIM/3D viewer, AI-assisted workflow.
3. Experience evidence cards from real career projects.
4. Skills grouped by function.
5. AI workflow section as a professional differentiator, not the whole identity.

## Implementation Notes

- Use existing React/Vite/Tailwind setup and local CSS. Do not require Magic UI package install unless needed.
- Local Magic UI-inspired components can live under `src/components/magic/`.
- Add markers for smoke tests: `data-ui-pass="magic-resume-portfolio"` and `data-source="060703-resume"`.
- All visible interactions must be wired to state.
