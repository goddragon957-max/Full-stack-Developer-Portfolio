# Verification — Bruno-inspired drivable portfolio

## Static gates

```bash
npm run test
npm run lint
npm run build
```

Expected:

- content smoke passes Bruno-style game markers;
- TypeScript passes;
- Vite production build succeeds.

## Browser/play smoke

Start preview:

```bash
npm run preview -- --host 0.0.0.0 --port 4190 --strictPort
```

Verify in browser:

```js
document.querySelector('[data-app="loop-dog-lab"]') !== null
document.querySelector('[data-ui-pass]')?.getAttribute('data-ui-pass') === 'bruno-inspired-drive-portfolio'
document.querySelector('[data-font]')?.getAttribute('data-font') === 'pretendard'
document.querySelector('[data-source]')?.getAttribute('data-source') === '060703-resume'
document.querySelector('[data-game-world]')?.getAttribute('data-game-world') === 'bruno-inspired'
document.querySelector('[data-game-world] canvas') !== null
```

Interaction checks:

1. Press `ArrowUp` or `W` for at least 500ms.
2. Confirm `data-car-x` or `data-car-z` changes.
3. Press left/right and confirm the car continues to respond.
4. Drive near a station or click a top landmark and confirm `data-active-zone` changes from `intro` to one of:
   - `stack`
   - `career`
   - `bim`
   - `contact`
5. Confirm HUD text includes Stack Garage / Career Road / BIM Yard / Contact Gate across the page source.
6. Confirm no generated hero image is rendered and these files do not exist:
   - `public/assets/portfolio-hero-gpt.webp`
   - `src/components/PortfolioDoodle.tsx`
   - `src/components/TechScene3D.tsx`
7. Confirm console has zero fatal JavaScript errors.

## Visual QA scorecard

Score each 0/1/2. Any 0 is a hard fail.

| Criterion | Pass target |
|---|---|
| Product read in 3 seconds | Reads as a playful 3D portfolio/game, not a normal dashboard |
| Focal object readability | Red/orange car is visible and appealing |
| World readability | Ground, roads, stations, signs, and map layout are understandable |
| Interaction readability | Controls and HUD make it clear that the user can drive |
| Portfolio readability | Java/Spring Boot, React/TypeScript, PostgreSQL, AWP/BIM are visible |
| Screenshot desirability | A screenshot should make the user want to try driving |

## Known acceptable limitations

- This is Bruno-inspired, not a clone. It does not use Bruno Simon assets or code.
- Physics are lightweight arcade-style movement, not full rigid-body simulation.
