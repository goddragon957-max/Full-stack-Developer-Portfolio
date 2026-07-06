# DESIGN.md — 엄신용 Portfolio

## Product type

Cyberpunk interactive 3D developer portfolio / playable landing page.

## Source of truth

Public copy must be grounded in `060703.pdf` resume extraction and approved docs:

- `docs/content-map.md`
- `docs/copy/hero.md`

Do not invent side-project narratives, fake metrics, stock-art copy, generic AI portfolio language, or sentimental slogans.

## Current direction

The portfolio is now **Cyberpunk Dev City**.

Core idea:

- user drives a neon hover rover through a dark cyberpunk developer city;
- the world has portfolio zones as hologram landmarks;
- Stack, Career, BIM/AWP, and Contact are shown as city districts;
- the canvas is the product, not decoration;
- no paid car model is required for this pass because the style relies on lighting, silhouettes, neon signage, and HUD polish rather than photorealistic asset fidelity.

## Visual language

- cyberpunk, not toy low-poly;
- dark navy/black environment;
- cyan + magenta neon as the main system;
- green/violet used only as zone accents;
- hover rover, not boxy toy car;
- neon city skyline, hologram signs, grid floor, data rails;
- compact premium HUD, not giant dashboard cards;
- Pretendard for Korean readability;
- source-grounded Korean copy.

## Portfolio zones

- `NEON STACK GARAGE` — Java, Spring Boot, React, TypeScript, PostgreSQL, MyBatis
- `CAREER MAINFRAME` — PHP/CodeIgniter, REST API, Vue.js, AWS, Linux
- `BIM GRID YARD` — AWP, BIM, xeokit, XKT, Three.js, tile/LOD
- `SIGNAL GATE` — GitHub, portfolio, career/contact destination

## Interaction contract

- `WASD` and arrow keys drive the hover rover;
- `Space` brakes;
- touch controls are available on small screens;
- top landmark links jump the rover to each district;
- approaching/clicking zones changes `data-active-zone` and HUD content;
- mini map shows rover and district dots;
- browser smoke must verify canvas, movement, landmark jump, and zero fatal console errors.

## Implementation markers

- `data-ui-pass="cyberpunk-dev-city-portfolio"`
- `data-theme="cyberpunk"`
- `data-game-world="cyberpunk-dev-city"`
- `data-source="060703-resume"`

## Avoid

- bright pastel toy world;
- primitive box car as the visual focal point;
- paid-model dependency as a blocker;
- generated `portfolio-hero-gpt.webp` image;
- old `TechScene3D` static Spline-like hero;
- old `PortfolioDoodle` image component;
- scroll-heavy resume landing as the main experience;
- sentimental copy: 따뜻함, 어린왕자, 기술과 사람을 연결, 함께 성장;
- AI as the main identity.
