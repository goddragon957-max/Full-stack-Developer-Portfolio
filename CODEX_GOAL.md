# Codex Goal — Loop Dog Lab v0.1

Build a Vercel-ready portfolio website called **Loop Dog Lab**.

## Required Narrative

The owner is not just listing projects. The portfolio should communicate:

> AI가 답만 하는 시대를 넘어, 일을 맡고, 만들고, 검증하고, 다시 고치는 루프를 설계합니다.

Include:

- Loop Engineering
- Harness Engineering
- OpenClaw × Hermes workflow
- DengDeng / 댕댕이 as execution agent
- MeongMeong / 멍멍이 as verification/orchestration agent
- Side projects as real product/lab cards

## Required Projects

- MOM Voice / Nestory
- Dragon Trader Lab
- Search Router
- Prototype Factory
- Side Hustle Factory
- Family Fraud Shield
- Orbit Bloom
- Game & Motion Lab
- Commerce Link Engine
- Flight Price Watch
- Marry1
- Factory Dashboard / Wiki / Chief Lab

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- Zustand
- Lucide Icons
- local shadcn/ui-style components
- StyleSeed-inspired product-lab UI

## Verification

```bash
npm run test
npm run lint
npm run build
```

Browser smoke:

- `data-app="loop-dog-lab"` exists.
- project filter changes card list.
- clicking a project changes `data-selected-project`.
- `/goal` vs `/ralph` toggle changes `data-mode-card`.
- console JS errors are zero.
