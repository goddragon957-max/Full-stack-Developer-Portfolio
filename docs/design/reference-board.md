# Reference Board - Cozy Pixel Farming Portfolio

## Concept Chosen By User

The new direction is an original cozy farming pixel-art developer portfolio. It borrows only the broad genre mood of a warm 2D farming village: cottages, crops, paths, signboards, and a small character avatar.

The previous 3D/cyberpunk direction is rejected for this project because it became dark, generic, and hard to read as a portfolio.

## Legal / Style Boundary

Do not copy Stardew Valley assets, sprites, UI, logos, names, text, exact maps, characters, or layout. This portfolio should feel source-grounded to the developer and should use original DOM/CSS pixel art plus the generated `cozy-farming-village-tileset-4x3.png` only as a small supporting reference detail.

## Primary Art Direction

Visual metaphor:

- a small developer farm acts as a portfolio village;
- buildings are clickable career landmarks;
- the character moves between landmarks as the active state changes;
- practical career evidence appears in a notebook/signboard panel.

Keywords:

- cozy pixel village
- warm paper
- green fields
- soil paths
- colorful roofs
- developer farmer
- readable portfolio
- practical career evidence

## Palette

- page background: cream / warm paper
- ground: saturated grass greens
- paths and fields: soil browns
- roofs: blue, red, yellow, purple
- text: dark brown
- panels: notebook cream with hard shadow

## Landmark Naming

- `FARMHOUSE` - Home / Developer Farm
- `WORKSHOP` - Skills
- `MARKET` - Projects
- `BARN` - Backend & Infra
- `COMMUNITY BOARD` - Experience
- `MAILBOX` - Contact

## Required Technology Nouns

Use the source-grounded nouns directly in visible content:

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

## Implementation Rules

### Map

- build with semantic DOM and CSS classes such as `.pixel-map`, `.pixel-building`, `.pixel-character`, `.field`, and `.path`;
- use buttons for landmarks;
- expose `data-ui-pass="cozy-pixel-farm-portfolio"`;
- expose `data-game-world="cozy-farming-village"`;
- expose `data-active-zone` and `data-player-zone`.

### Typography

- use Pretendard for Korean/body copy;
- use monospace/pixel-like treatment only for tiny labels, badges, kbd hints, and buttons;
- keep `word-break: keep-all` in the main UI.

### Mobile

- switch to a vertical portfolio;
- keep the village visible;
- preserve click and keyboard interactions where hardware keyboard exists.

## First-Frame Scorecard

Any 0 is fail.

| Criterion | 0 | 1 | 2 |
|---|---|---|---|
| Cozy village read | unclear | partial | immediately readable |
| Portfolio clarity | hidden | partially clear | landmark to content mapping is obvious |
| Character | missing | visible but weak | clear small developer/farmer avatar |
| Originality | copied | too referential | original source-grounded identity |
| Typography | novelty font noise | acceptable | Pretendard body copy is comfortable |
| Mobile | broken | usable | vertical layout reads cleanly |
