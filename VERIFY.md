# Verification — 엄신용 Full-stack Portfolio

## Static Gates

```bash
npm run test
npm run lint
npm run build
```

Expected:

- content smoke passes required resume-grounded markers;
- TypeScript passes;
- Vite production build succeeds.

## Browser Smoke

Start preview:

```bash
npm run preview -- --host 0.0.0.0 --port 4190 --strictPort
```

Verify in browser:

```js
document.querySelector('[data-app="loop-dog-lab"]') !== null
document.querySelector('[data-ui-pass]')?.getAttribute('data-ui-pass') === 'gianluca-clean-portfolio'
document.querySelector('[data-font]')?.getAttribute('data-font') === 'pretendard'
document.querySelector('[data-source]')?.getAttribute('data-source') === '060703-resume'
```

Interaction checks:

1. Click the `AWP / BIM / 3D Viewer Work` capability card and confirm `[data-active-capability="bim"]`.
2. Click the `AI Workflow` experience filter and confirm `[data-selected-experience="ai-assisted-workflow"]`.
3. Confirm only real resume-grounded experience cards appear above personal/side-project material.
4. Confirm console has zero JavaScript errors.

## Visual QA

First screen should read as:

- clean Gianluca Patti / Lapa-inspired illustrated portfolio;
- Pretendard Korean typography that is readable at first glance;
- deeper operational copy, not sentimental warmth/어린왕자-style prose;
- warm cream paper, brown ink, lavender/sand accents;
- large GPT-generated abstract systems/BIM blueprint hero image at `public/assets/portfolio-hero-gpt.webp`;
- strong Korean full-stack developer introduction;
- no dark particle/glow-heavy Magic UI clutter;
- no mascot-led identity;
- no cringe developer-at-laptop character illustration;
- no public design-process phrases;
- no private resume data.
