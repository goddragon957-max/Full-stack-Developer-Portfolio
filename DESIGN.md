# DESIGN.md — 엄신용 Portfolio

## Product type

Interactive 3D developer portfolio / playable landing page.

## Source of truth

Public copy must be grounded in `060703.pdf` resume extraction and approved docs:

- `docs/content-map.md`
- `docs/copy/hero.md`

Do not invent side-project narratives, fake metrics, stock-art copy, or generic AI portfolio language.

## Current direction

The portfolio is now a **Bruno Simon-inspired drivable 3D world**. It should feel like a small portfolio game, not a normal landing page.

Core idea:

- user drives a small toy car around a low-poly portfolio map;
- the world has real portfolio zones: Stack Garage, Career Road, BIM Yard, Contact Gate;
- the HUD updates based on the car's location;
- the canvas is the product, not decoration;
- generated hero images and old static 3D hero cards are removed.

## Reference use

Reference: https://bruno-simon.com/

Borrow the interaction idea only:

- playful vehicle control;
- isometric/follow camera;
- simple low-poly world;
- portfolio content embedded as landmarks;
- lightweight HUD and movement instructions.

Do not copy Bruno Simon assets, exact layout, branding, or code.

## Public positioning

Main public facts remain:

- Java/Spring Boot and React/TypeScript full-stack work;
- PHP/CodeIgniter maintenance roots;
- 문자 발송 서버, 앱 API/관리자 페이지, 쇼핑몰 유지보수;
- AWP 업무 시스템과 3D/BIM 뷰어;
- PostgreSQL/MyBatis, Linux/AWS, xeokit/XKT/Three.js.

## Visual language

- bright playable world, not dark SaaS dashboard;
- low-poly toy-like 3D shapes;
- red/orange car as the focal object;
- pastel sky/green ground/dark road;
- glass HUD cards over the world;
- concise Korean copy;
- no sentimental/AI-sounding prose.

## Interaction contract

- `WASD` and arrow keys move the car;
- `Space` brakes;
- touch controls are available on small screens;
- approaching zones changes `data-active-zone` and the HUD content;
- mini map shows car and zone dots;
- browser smoke must verify the canvas, zone markers, and at least one real movement/state change.

## Implementation markers

- `data-ui-pass="bruno-inspired-drive-portfolio"`
- `data-game-world="bruno-inspired"`
- `data-source="060703-resume"`

## Avoid

- generated `portfolio-hero-gpt.webp` image;
- old `TechScene3D` static Spline-like hero;
- old `PortfolioDoodle` image component;
- scroll-heavy resume landing as the main experience;
- sentimental copy: 따뜻함, 어린왕자, 기술과 사람을 연결, 함께 성장;
- AI as the main identity.
