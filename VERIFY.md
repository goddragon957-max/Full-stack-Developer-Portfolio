# Verification — 엄신용 Full-stack Portfolio

## Static gates

```bash
npm run test
npm run lint
npm run build
```

Expected:

- content smoke passes Spline/Magic dark markers;
- TypeScript passes;
- Vite production build succeeds.

## Browser smoke

Start preview:

```bash
npm run preview -- --host 0.0.0.0 --port 4190 --strictPort
```

Verify in browser:

```js
document.querySelector('[data-app="loop-dog-lab"]') !== null
document.querySelector('[data-ui-pass]')?.getAttribute('data-ui-pass') === 'spline-dark-stack-portfolio'
document.querySelector('[data-font]')?.getAttribute('data-font') === 'pretendard'
document.querySelector('[data-source]')?.getAttribute('data-source') === '060703-resume'
document.querySelector('[data-hero-3d]')?.getAttribute('data-hero-3d') === 'spline-inspired'
document.querySelector('[data-hero-3d] canvas') !== null
```

Interaction checks:

1. Move the pointer over the 3D scene and confirm the scene reacts subtly.
2. Click the `AWP / BIM / 3D Viewer` capability card and confirm `[data-active-capability="bim"]`.
3. Click the `Backend/API` experience filter and confirm `[data-selected-experience="message-server"]`.
4. Confirm no generated hero image is rendered and `public/assets/portfolio-hero-gpt.webp` does not exist.
5. Confirm console has zero JavaScript errors.

## Visual QA

First screen should read as:

- dark 3D landing inspired by Spline;
- Magic UI-style dark grid/glow/glass surface;
- stack-first developer portfolio, not generic AI art;
- Java/Spring Boot and React/TypeScript visible above the fold;
- PostgreSQL/MyBatis, Linux/AWS, AWP/BIM visible in stack/detail sections;
- short, resume-like Korean copy;
- no sentimental/어린왕자 prose;
- no AI-as-main-identity section above career evidence.
