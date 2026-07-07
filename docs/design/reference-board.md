# Reference Board — Portfolio Inside a Cozy Farming RPG

## Rejected interpretations

The user rejected these directions:

1. GPT/generated portfolio hero images — looked cringe/AI-like.
2. Spline/Magic UI dark 3D landing — unreadable/generic.
3. Bruno/Three.js drivable 3D portfolio — toy-like and not professionally designed.
4. Cyberpunk Dev City — strongly rejected.
5. Cozy pixel portfolio page — still wrong because it placed a game-like map inside a portfolio page.

## Correct interpretation

The portfolio must be embedded **inside the game**, not the other way around.

> Build a playable 2D cozy farming RPG slice. The user discovers portfolio content by walking around, entering a house, inspecting objects, reading journal entries, and completing small interactions.

## Visual direction

- Original cozy farming RPG feel inspired by the genre, not copied Stardew Valley assets/UI/text.
- Generated pixel-art assets are the source of truth.
- CSS is for layout/HUD/hotspots only, not for fake hand-made pixel art characters or important objects.
- The house interior is a generated game room background.
- Portfolio content is inside generated objects:
  - SKILL desk
  - QUEST board
  - SERVER shelf
  - BIM blueprint table
  - JOURNAL shelf
  - MAIL table

## Current generated assets

- `public/assets/cozy-farming-village-tileset-4x3.png`
- `public/assets/game-sprites/`
- `public/assets/generated-sheets/farmhouse-interior-room.png`
- `public/assets/generated-sheets/developer-farmer-character-sheet.png`
- `public/assets/generated-sheets/developer-farmhouse-interior-sheet.png`
- `public/assets/generated-sprites/character/`
- `public/assets/generated-sprites/interior/`

## Gameplay contract

- Start at a fullscreen pixel title screen with `EOM SINYONG` typed in a dot/pixel style.
- Start with Enter/Space/E or the START GAME button.
- The game map must fill the screen.
- No top HUD/status bar and no right sidebar in the normal play view.
- Dialogue appears as a speech-bubble overlay above the game world.
- A gear icon opens the only utility window, with MAP / ABOUT / SETTINGS tabs.
- Hold WASD/arrows for continuous movement driven by `requestAnimationFrame`, not OS key repeat.
- Movement should change generated walking sprite frames.
- Interact with E/Space.
- Farmhouse interaction enters the interior scene.
- Interior object interaction unlocks portfolio journal entries.
- Crop patch can be harvested to change state.
- Browser QA must verify real state changes, not just visible text.

## First-3-seconds visual scorecard target

- Genre readability: cozy farming RPG immediately readable.
- Character readability: generated player sprite visible and charmful.
- Stage readability: outside farm and generated house interior are authored spaces.
- HUD readability: persistent HUD rails are absent; gear menu, map overlay, and speech bubble read as game UI.
- Screenshot desirability: should look like a small playable game, not a portfolio website.

## Anti-regression rule

Do not reintroduce:

- static portfolio hero/header as the main structure;
- landmark buttons as primary navigation;
- permanent portfolio side cards;
- CSS-drawn fake characters/buildings;
- generated images shown only as decorative thumbnails;
- 3D/cyberpunk/glow directions.
