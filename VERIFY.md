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
document.querySelector('[data-ui-pass]')?.getAttribute('data-ui-pass') === 'magic-resume-portfolio'
document.querySelector('[data-source]')?.getAttribute('data-source') === '060703-resume'
```

Interaction checks:

1. Click the `AWP / BIM / 3D Viewer Work` capability card and confirm `[data-active-capability="bim"]`.
2. Click the `AI Workflow` experience filter and confirm `[data-selected-experience="ai-assisted-workflow"]`.
3. Confirm only real resume-grounded experience cards appear above personal/side-project material.
4. Confirm console has zero JavaScript errors.

## Visual QA

First screen should read as:

- flashy Magic UI-inspired technical portfolio;
- dark premium cyan/violet glow system;
- strong Korean full-stack developer introduction;
- 3D full-stack/BIM/AI engine visual on the right;
- no mascot-led identity;
- no public design-process phrases;
- no private resume data.
