# Loop Dog Lab Agent Instructions

## Product Goal

Build and maintain a Vercel-ready portfolio website that positions the owner as an AI product builder focused on Loop Engineering, Harness Engineering, OpenClaw/Hermes workflows, and side-project execution.

## Non-negotiables

- Do not turn the portfolio into a generic resume template.
- Preserve the central narrative: **AI 작업 루프 + 검증 하네스 + 댕댕이/멍멍이 역할 분리**.
- Treat this as Marketing UI / personal portfolio design, not a dashboard or generic shadcn showcase.
- Follow `DESIGN-BRIEF.md`: Rauno card rhythm, Brittany rail structure, Paco restraint, Josh-style small playful details.
- Keep mascots small and role-driven; do not make a giant character illustration the hero.
- Keep the page deployable as a static Vite app on Vercel.
- Every visible filter/toggle should be wired to state, not decorative only.
- Run `npm run test`, `npm run lint`, and `npm run build` before reporting complete.
- For visual changes, run a browser smoke test and check console errors.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 through `@tailwindcss/vite`
- Zustand
- Lucide Icons
- Local shadcn/ui-style components in `src/components/ui`

## StyleSeed UI Standard

Use StyleSeed as the default design judgment layer for this project.
Read https://styleseed-demo.vercel.app/llms.txt before major UI changes.
Apply StyleSeed rules to every section, card, empty state, responsive state, and motion detail.

Golden rules:

- Keep content inside cards/surfaces, not bare page backgrounds.
- Use one signal-green accent system on warm grayscale; avoid rainbow gradients and random hardcoded palettes in future additions.
- Keep radius, shadows, icon treatment, spacing, and typography coherent.
- Touch targets should be at least 44×44px when interactive.
- Build real UI state: filters, selected project detail, and mode switch should visibly change.
- For rejected visual work, write/read a design direction first, then implement. Do not start another cosmetic pass from the same failed screen.

## `/goal` Prompt for Future Codex Work

```md
/goal Improve Loop Dog Lab portfolio.

Context:
- Vercel-ready Vite/React/TypeScript portfolio.
- Central narrative: Loop Engineering, Harness Engineering, OpenClaw/Hermes, 댕댕이 and 멍멍이 mascots.
- Preserve premium dark AI product lab style; do not make it a generic resume template.

Task:
Pick one concrete improvement slice, implement it, and verify it.
Good next slices:
- add project detail modal/pages;
- improve mascot illustration/animation;
- add case-study timeline for MOM Voice, Search Router, Dragon Trader Lab;
- add GitHub/Vercel links after repository is connected;
- improve mobile hero composition.

Verification:
- npm run test
- npm run lint
- npm run build
- browser smoke test: page loads, filters work, selected project detail changes, /goal vs /ralph toggle changes text, console has zero JS errors.
```

## `/ralph` Use

Use `/ralph` mode when the instruction is not just “implement the goal” but “do not report done until it is truly complete.” In this project that means:

1. Implement the slice.
2. Run test/lint/build.
3. Run browser smoke on a fresh local preview port.
4. Inspect the page visually enough to catch generic/ugly/regressed layout.
5. Fix any blocker or obvious quality regression.
6. Commit only after verification passes.
7. Report with exact commands and preview/deploy status.
```
