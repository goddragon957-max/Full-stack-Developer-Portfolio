# DESIGN.md — 엄신용 Portfolio

## Product Type

Personal developer portfolio / career introduction page.

## Source of Truth

Public copy must be grounded in `060703.pdf` resume extraction and the approved docs:

- `docs/content-map.md`
- `docs/copy/hero.md`

Do not invent side-project narratives or filler marketing copy. If there is not enough copy, define the section function only.

## Public Positioning

A full-stack developer who reads existing systems and changes only what needs to change. The public narrative should emphasize operational judgment: understanding code, API, DB, server, deployment, domain constraints, and verification before changing a running service.

## Visual Direction

The user rejected the dark Magic UI pass because it was not readable. The approved direction is now **Gianluca Patti / Lapa-style clean portfolio**:

- light warm paper background;
- readable Pretendard typography;
- dark brown ink color;
- soft lavender/sand accent palette;
- large GPT-generated abstract systems/BIM blueprint hero at `public/assets/portfolio-hero-gpt.webp`;
- rounded lavender intro card;
- simple uppercase nav;
- generous spacing and low visual noise.
- deeper operational copy inspired by Maggie Appleton's layered self-description, Tom MacWright's built-history directness, Tania Rascia's plain credibility, and swyx's public thesis style.

Reference traits to preserve:

- big illustration first, text card second;
- minimal top navigation with round pills;
- cream/off-white surfaces;
- thick brown outlines on key cards;
- polished editorial abstract systems illustration, not people, mascots, particle/aurora/glow effects, or developer-at-laptop clichés.

## Avoid

- unreadable oversized condensed Korean typography;
- dark glow-heavy Magic UI effects;
- particles, animated grids, border beams, shimmer text;
- public design-process phrases like “Marketing UI rebuild”, “귀여운 척을 빼고”, or reference-site names;
- making Loop Dog Lab, mascots, 댕댕이/멍멍이, or internal agent jargon the first-screen identity;
- publishing private details from the PDF: phone, personal email, address, salary, military information;
- fake metrics or unrelated side-project cards above career evidence.
- sentimental "warmth" copy, 어린왕자-style softness, or generic "technology and people" language.

## Layout

1. Top nav with USY mark, centered links, small rounded action pills.
2. Hero split:
   - left: GPT-generated no-person systems/workflow/BIM blueprint hero illustration;
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
- Keep generated hero asset marker `data-hero-image="gpt-generated"` and verify `public/assets/portfolio-hero-gpt.webp` exists before build.
- All visible interactions must be wired to state.
- Browser QA should judge readability before visual novelty.
