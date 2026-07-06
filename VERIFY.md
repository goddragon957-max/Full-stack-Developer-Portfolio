# Verification — Cyberpunk Dev City portfolio

## Static gates

```bash
npm run test
npm run lint
npm run build
```

Expected:

- content smoke passes Cyberpunk Dev City markers;
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
document.querySelector('[data-ui-pass]')?.getAttribute('data-ui-pass') === 'cyberpunk-dev-city-portfolio'
document.querySelector('[data-font]')?.getAttribute('data-font') === 'pretendard'
document.querySelector('[data-source]')?.getAttribute('data-source') === '060703-resume'
document.querySelector('[data-theme]')?.getAttribute('data-theme') === 'cyberpunk'
document.querySelector('[data-game-world]')?.getAttribute('data-game-world') === 'cyberpunk-dev-city'
document.querySelector('[data-game-world] canvas') !== null
```

Interaction checks:

1. Press `ArrowUp` or `W` for at least 500ms.
2. Confirm `data-car-x` or `data-car-z` changes.
3. Press left/right and confirm the rover continues to respond.
4. Click a top landmark and confirm `data-active-zone` changes from `intro` to one of:
   - `stack`
   - `career`
   - `bim`
   - `contact`
5. Confirm HUD text includes Neon Stack Garage / Career Mainframe / BIM Grid Yard / Signal Gate across the page source.
6. Confirm no generated hero image or old static 3D scene is rendered and these files do not exist:
   - `public/assets/portfolio-hero-gpt.webp`
   - `src/components/PortfolioDoodle.tsx`
   - `src/components/TechScene3D.tsx`
7. Confirm console has zero fatal JavaScript errors.

## Visual QA scorecard

Score each 0/1/2. Any 0 is a hard fail.

| Criterion | Pass target |
|---|---|
| Product read in 3 seconds | Reads as cyberpunk 3D portfolio, not a default Three.js sample |
| Focal object readability | Hover rover is visible, dark, neon, and not a toy box car |
| World readability | Neon city, grid floor, roads, district holograms, skyline are understandable |
| Lighting/materials | Cyan/magenta lighting and dark metal/glass feel intentional |
| HUD readability | Compact premium HUD, readable Korean, not a huge dashboard slab |
| Portfolio readability | Java/Spring Boot, React/TypeScript, PostgreSQL, AWP/BIM are visible |
| Screenshot desirability | A screenshot should make the user want to try driving |

## Known acceptable limitations

- This pass does not require paid models.
- The hover rover is custom procedural geometry; it should read as cyberpunk vehicle silhouette rather than photoreal car.
- Physics are lightweight arcade-style movement, not full rigid-body simulation.
