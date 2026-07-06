# Reference Board — Cyberpunk Dev City Portfolio

## Concept chosen by user

The user selected a cyberpunk direction after rejecting the previous toy-like Three.js look.

Final visual lane for the next passes:

> Cyberpunk Dev City — a dark neon developer city where a hover rover drives through source-grounded portfolio districts.

## Why this solves the paid-model problem

A professional automotive/photoreal direction often depends on premium car models, good UVs, studio materials, and configurator-level rendering.

Cyberpunk can avoid that dependency because quality comes from:

- strong silhouette rather than photoreal detail;
- dark environment hiding nonessential geometry;
- neon lighting and emissive materials;
- city skyline composition;
- hologram signage;
- compact HUD polish;
- camera/framing.

So the vehicle can be a custom procedural hover rover instead of a paid GLB car, as long as it is not a boxy toy car.

## Primary art direction

### Cyberpunk Dev City

Visual metaphor:

- a neon hover rover travels through a developer city;
- tech stack, career, BIM/AWP, and contact become city districts;
- portfolio content is displayed as hologram signage and HUD signals;
- the site feels like a technical night drive, not a playful toy map.

Keywords:

- dark cyberpunk
- cyan/magenta neon
- hologram districts
- hover rover
- dev city
- BIM grid
- mainframe
- signal gate
- premium HUD

## Palette

- background: deep navy/black `#030612`, `#080418`
- primary neon: cyan `#00e5ff`
- secondary neon: magenta `#ff2bd6`
- zone accent: green `#39ff14`, violet `#a855f7`
- text: cool white `#ecfeff`

## Portfolio district naming

- `NEON STACK GARAGE` — Java, Spring Boot, React, TypeScript, PostgreSQL, MyBatis
- `CAREER MAINFRAME` — PHP/CodeIgniter, REST API, Vue.js, AWS, Linux
- `BIM GRID YARD` — AWP, BIM, xeokit, XKT, Three.js, tile/LOD
- `SIGNAL GATE` — GitHub, portfolio, career/contact destination

## Implementation rules

### Vehicle

Use a custom hover rover silhouette:

- no primitive box car as focal object;
- no wheels needed;
- body should be dark metal with neon strips;
- cockpit should glow cyan;
- hover pods/underglow should make it feel intentional;
- first screenshot must make the vehicle readable.

### World

- dark ground with neon grid;
- roads with cyan/magenta lane strips;
- city skyline around the perimeter;
- district platforms with hologram rings;
- vertical neon pillars/signage;
- data rails across the floor.

### HUD

- compact translucent dark panels;
- cyan/magenta border glow;
- Korean readable in Pretendard;
- avoid large bright cards that cover the scene;
- controls and minimap should feel like cockpit UI.

## Good references to inspect for quality bar

- Awwwards WebGL — https://www.awwwards.com/websites/webgl/
- Awwwards 3D — https://www.awwwards.com/websites/3d/
- CSS Nectar WebGL — https://cssnectar.com/css-gallery/nominees/site-features/webgl/
- Bruno Simon — https://bruno-simon.com/ only for interaction pattern, not art style

## First-frame scorecard

Any 0 is fail.

| Criterion | 0 | 1 | 2 |
|---|---|---|---|
| Cyberpunk read | unclear | partial neon | immediately cyberpunk |
| Vehicle quality | toy box | decent rover | designed hover rover |
| World identity | random shapes | neon grid only | coherent dev city |
| Lighting/materials | default Three.js | okay glow | intentional cinematic neon |
| HUD integration | dashboard slab | usable | cockpit/premium HUD |
| Portfolio clarity | hidden | partially clear | districts map to real career evidence |

## Next implementation prompt

"Continue the Cyberpunk Dev City portfolio. Improve the first screenshot before adding features: make the hover rover more readable, make the neon city skyline denser but not cluttered, reduce HUD coverage, and verify with browser screenshot QA that it no longer looks like a default Three.js sample or toy car prototype."
