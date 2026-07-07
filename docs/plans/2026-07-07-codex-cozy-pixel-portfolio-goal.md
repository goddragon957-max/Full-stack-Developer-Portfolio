# Codex Goal — Cozy Pixel Farming Portfolio

## User direction

Verbatim/latest direction:

- "저런식으로 도트 이미지 만들어서 캐릭터랑 같이 해서 https://ko.stardewvalleywiki.com/Stardew_Valley_Wiki 스타듀벨리 느낌에 포트폴링오 어때"
- "오 좋아좋아 goal 모드로 만들어보자"

Previous rejected directions:

- GPT/generated developer hero image felt cringe/AI-like.
- Spline/3D/dark Magic UI became unreadable or generic.
- Bruno/Three.js drivable 3D world looked toy-like.
- Cyberpunk Dev City was strongly rejected.

## Product-class target

Build an original **cozy farming pixel-art developer portfolio**: a readable web portfolio that feels like a small 2D RPG village/farm, not a clone of Stardew Valley and not a full farming game.

Important legal/style boundary:

- Do **not** copy Stardew Valley assets, UI, logos, names, characters, sprites, icons, maps, text, or exact screen layout.
- Use only a broad genre feel: cozy farming village, pixel-art cottages, crops, signboards, character avatar, warm RPG map mood.
- The visual identity should be original and source-grounded to this portfolio.

## Canonical repo

Work only inside:

`/home/sy/.openclaw/workspace/loop-dog-lab`

## Read first

Read these before editing:

- `package.json`
- `src/App.tsx`
- `src/styles.css`
- `scripts/smoke-content.mjs`
- `DESIGN.md`
- `README.md`
- `VERIFY.md`
- `docs/design/reference-board.md`
- `public/assets/cozy-farming-village-tileset-4x3.png` exists as a generated reference asset sheet. It may be displayed as a small reference/art detail, but do not rely on it as the only UI. Build a real portfolio interface around a pixel village and character.

## Non-negotiable rebuild scope

Replace the current rejected 3D/Cyberpunk implementation with a 2D pixel portfolio:

1. `src/App.tsx` must no longer mount `PortfolioGame3D`.
2. Remove or orphan all visible Cyberpunk/3D markers from the public UI.
3. Implement a 2D pixel village interface using React + CSS. SVG/CSS/HTML pixel-art is acceptable; no canvas engine is required for this pass.
4. Include a visible small developer/farmer character avatar on the map.
5. Include clickable/keyboard-selectable portfolio landmarks:
   - FARMHOUSE / Home
   - WORKSHOP / Skills
   - MARKET / Projects
   - BARN / Backend & Infra
   - COMMUNITY BOARD / Experience
   - MAILBOX / Contact
6. Use the user's source-grounded technology nouns:
   - Java
   - Spring Boot
   - React
   - TypeScript
   - PostgreSQL
   - MyBatis
   - AWS
   - Linux
   - AWP
   - BIM
   - xeokit
   - XKT
7. Make the interface readable:
   - Pretendard for body/Korean copy.
   - Pixel font/monospace only for tiny labels/buttons/badges.
   - Avoid unreadable novelty fonts for main text.
8. Mobile must degrade to a readable vertical portfolio with the pixel village still visible.
9. Keep interactions real, not decorative:
   - clicking a landmark changes active zone card/content;
   - arrow keys or WASD move/select the character between zones, or at minimum change the active zone and character position;
   - expose `data-active-zone` and `data-player-zone` on a stable root element.

## Desired visual language

- Warm paper/cream page background.
- Cozy saturated greens, soil browns, roof blues/yellows/reds/purples.
- Crisp pixel-art edges, soft outlines, no glossy 3D/glow/cyberpunk.
- Small farm village map as the first visual impression.
- Section labels may use small green sprout icons.
- UI cards should feel like signboards/notebook panels, not SaaS dashboards.
- Keep it cute but not childish: portfolio information remains practical and concise.

## Suggested component shape

You may create:

- `src/components/PixelPortfolioVillage.tsx`
- supporting small data arrays in the same file or `src/data/portfolioZones.ts`
- CSS in `src/styles.css`

Implementation hints:

- Build map as semantic DOM: `.pixel-map`, `.pixel-building`, `.pixel-character`, `.crop-row`, `.path`, etc.
- Use CSS `image-rendering: pixelated`, hard shadows/box-shadows, grid backgrounds, and blocky shapes.
- Use buttons for landmarks so keyboard/focus works.
- Avoid fake ARIA tabs unless implementing real tab behavior.

## Required public markers

Update app/test/docs so these markers exist and old rejected markers are gone:

Required:

- `data-ui-pass="cozy-pixel-farm-portfolio"`
- `data-game-world="cozy-farming-village"`
- `data-active-zone`
- `data-player-zone`
- `PixelPortfolioVillage`
- `cozy-farming-village-tileset-4x3.png`
- `FARMHOUSE`
- `WORKSHOP`
- `MARKET`
- `BARN`
- `COMMUNITY BOARD`
- `MAILBOX`
- `Developer Farm`
- `Pretendard`
- `word-break: keep-all`
- the source technology nouns listed above

Forbidden in public UI/source markers for this pass:

- `cyberpunk-dev-city-portfolio`
- `Cyberpunk Dev City`
- `data-theme="cyberpunk"`
- `data-game-world="cyberpunk-dev-city"`
- `PortfolioGame3D`
- `createHoverRover`
- `addNeonCity`
- `NEON STACK GARAGE`
- `CAREER MAINFRAME`
- `BIM GRID YARD`
- `SIGNAL GATE`
- `cyan/magenta`
- `portfolio-hero-gpt.webp`
- copied names/assets/text from Stardew Valley

## Docs to update

- Rewrite `DESIGN.md` to the new cozy pixel farm portfolio contract.
- Update `README.md` to describe the new direction and controls.
- Update `VERIFY.md` with build/lint/test/browser checks.
- Update `docs/design/reference-board.md` to mark 3D/cyberpunk as rejected and pixel farm as the new direction.
- Update `scripts/smoke-content.mjs` to enforce the new markers and forbid old ones.

## Verification commands

Run and report exact results:

```bash
npm run test
npm run lint
npm run build
```

Then start preview on a strict port, for example:

```bash
npm run preview -- --host 0.0.0.0 --port 4192 --strictPort
```

Browser smoke expectations:

- page loads with no fatal JS console errors;
- root has `data-ui-pass="cozy-pixel-farm-portfolio"`;
- root has `data-game-world="cozy-farming-village"`;
- six landmark buttons exist;
- clicking `MARKET` changes `data-active-zone` to `market` and visible card content changes;
- pressing ArrowRight or `d` changes player/active zone state or position;
- screenshot first impression clearly reads as a cozy 2D pixel portfolio village, not 3D/cyberpunk/dashboard.

## Commit policy

Do not push. Commit locally only after verification passes.

Suggested commit message:

`Rebuild portfolio as cozy pixel farming village`
