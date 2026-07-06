# DESIGN.md — 엄신용 Portfolio

## Product type

Personal developer portfolio / landing page.

## Source of truth

Public copy must be grounded in `060703.pdf` resume extraction and approved docs:

- `docs/content-map.md`
- `docs/copy/hero.md`

Do not invent side-project narratives, fake metrics, stock-art copy, or generic AI portfolio language.

## Current direction

The generated image direction was rejected. The page now uses a **Spline-inspired dark 3D landing** instead of an image file:

- no generated hero image;
- no stock illustration;
- no mascot or person-at-laptop scene;
- WebGL/Three.js 3D stack scene on the landing screen;
- Magic UI-like dark grid, glow, glass panels, animated border treatment;
- primary visible objects are stack/domain labels: React, Spring Boot, PostgreSQL, AWP/BIM;
- copy stays short and resume-like.

## Public positioning

> Java/Spring Boot와 React/TypeScript로 웹 서비스를 개발합니다.

Support copy:

> PHP/CodeIgniter 유지보수에서 시작해 문자 발송 서버, 앱 API·관리자 페이지, AWP 업무 시스템과 3D/BIM 뷰어를 다뤘습니다.

## Layout

1. Dark glass nav.
2. Landing hero:
   - left: name, role, short career summary, CTAs;
   - right: Spline-inspired WebGL 3D tech scene.
3. Summary stats.
4. Stack detail cards.
5. Career evidence cards.
6. Capability cards.
7. Footer.

## Visual notes

- Reference Spline for the feeling of floating 3D objects, depth, orbiting rings, and glass material.
- Reference Magic UI dark mode for grid background, glowing gradients, glass cards, and animated borders.
- Keep the result portfolio-readable. The 3D scene supports the stack; it should not hide the resume content.

## Avoid

- generated `portfolio-hero-gpt.webp` image;
- abstract AI image files;
- people-at-laptop scenes;
- sentimental copy: 따뜻함, 어린왕자, 기술과 사람을 연결, 함께 성장;
- AI as the main identity. AI tools may appear under Tools only.

## Implementation markers

- `data-ui-pass="spline-dark-stack-portfolio"`
- `data-hero-3d="spline-inspired"`
- `data-source="060703-resume"`
