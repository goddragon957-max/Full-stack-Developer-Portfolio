# Verification - Cozy Pixel Farming Portfolio

## Static Gates

```bash
npm run test
npm run lint
npm run build
```

Expected:

- content smoke passes cozy pixel farm markers;
- TypeScript passes;
- Vite production build succeeds.

## Browser Smoke

Start preview:

```bash
npm run preview -- --host 0.0.0.0 --port 4192 --strictPort
```

Verify in browser:

```js
const root = document.querySelector('[data-ui-pass="cozy-pixel-farm-portfolio"]')
root !== null
root?.getAttribute('data-game-world') === 'cozy-farming-village'
root?.hasAttribute('data-active-zone') === true
root?.hasAttribute('data-player-zone') === true
document.querySelectorAll('.pixel-building').length === 6
document.body.innerText.includes('FARMHOUSE')
document.body.innerText.includes('WORKSHOP')
document.body.innerText.includes('MARKET')
document.body.innerText.includes('BARN')
document.body.innerText.includes('COMMUNITY BOARD')
document.body.innerText.includes('MAILBOX')
```

Interaction checks:

1. Confirm console has no fatal JavaScript errors.
2. Click `MARKET`.
3. Confirm `data-active-zone` and `data-player-zone` become `market`.
4. Confirm the visible content changes to project copy.
5. Press `ArrowRight` or `D`.
6. Confirm active/player zone state or character position changes.
7. Confirm the page includes Java, Spring Boot, React, TypeScript, PostgreSQL, MyBatis, AWS, Linux, AWP, BIM, xeokit, and XKT.

## Visual QA Scorecard

Score each 0/1/2. Any 0 is a hard fail.

| Criterion | Pass target |
|---|---|
| Product read in 3 seconds | Reads as a cozy 2D pixel portfolio village |
| Character | Small developer/farmer avatar is visible on the map |
| Landmarks | Six clickable buildings/signboards are readable |
| Portfolio clarity | The active card clearly maps landmarks to career evidence |
| Typography | Pretendard body copy is readable; tiny labels can be monospace |
| Mobile | Vertical layout remains readable and keeps the village visible |

## Known Acceptable Limitations

- This pass does not require a canvas/game engine.
- The village art is made from DOM/CSS pixel shapes.
- The generated asset sheet is a supporting detail, not the only interface.
