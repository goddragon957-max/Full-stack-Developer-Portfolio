# DESIGN.md — 엄신용 Portfolio

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

The user rejected the dark Magic UI pass because it was not readable. The approved direction is now **Gianluca Patti / Lapa-style clean portfolio**:

- light warm paper background;
- readable Pretendard typography;
- dark brown ink color;
- soft lavender/sand accent palette;
- large hand-drawn line-art hero illustration;
- rounded lavender intro card;
- simple uppercase nav;
- generous spacing and low visual noise.

Reference traits to preserve:

- big illustration first, text card second;
- minimal top navigation with round pills;
- cream/off-white surfaces;
- thick brown outlines on key cards;
- playful but controlled line art, not particle/aurora/glow effects.

## Avoid

- unreadable oversized condensed Korean typography;
- dark glow-heavy Magic UI effects;
- particles, animated grids, border beams, shimmer text;
- public design-process phrases like “Marketing UI rebuild”, “귀여운 척을 빼고”, or reference-site names;
- making Loop Dog Lab, mascots, 댕댕이/멍멍이, or internal agent jargon the first-screen identity;
- publishing private details from the PDF: phone, personal email, address, salary, military information;
- fake metrics or unrelated side-project cards above career evidence.

## Layout

1. Top nav with USY mark, centered links, small rounded action pills.
2. Hero split:
   - left: large line-art portfolio doodle;
   - right: lavender introduction card with resume-grounded copy.
3. Four source-grounded stats.
4. Four capability cards with a selected detail panel.
5. Experience evidence cards from real career projects.
6. AI workflow section as a professional differentiator.
7. Skills grouped by function.

## Implementation Notes

- Use existing React/Vite/Tailwind setup and local CSS.
- Use Pretendard as the primary font.
- Add markers for smoke tests: `data-ui-pass="gianluca-clean-portfolio"`, `data-font="pretendard"`, and `data-source="060703-resume"`.
- All visible interactions must be wired to state.
- Browser QA should judge readability before visual novelty.
