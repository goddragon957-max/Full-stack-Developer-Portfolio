# Mossbell Farm

Mossbell Farm is a playable cozy 2D pixel RPG built with Vite, React, and TypeScript.

## Play

```text
Enter / Space / E  Start
WASD / Arrow Keys  Move
E / Space          Interact, enter, fish, forage
1 / 2 / 3          Hoe, seeds, watering can
4                  Fishing rod
5                  Pickaxe
```

The world contains four connected `32x22` regions:

- Farm Village: crops, livestock, NPC quests, and five building interiors
- Whisper Forest: forage items and a forest quest
- River Coast: river and coast fishing
- Mine Foothill: ore, crystals, and a mining quest

Enter the farmhouse, seed shop, barn, Hana's cottage, and Jun's cottage by approaching their doors and pressing `E`. Edge roads connect the four outdoor regions without reloading the page.

## Systems

- Six crops with growth stages and quality grades
- Three chickens and two cows with daily care and products
- Day, night, dates, NPC schedules, quests, and celebrations
- Pond, river, and coast fishing
- Daily forage and mining nodes
- BAG, FARM, RANCH, and FORAGE inventory tabs
- Persistent progress through `localStorage`
- Region-aware background music from `public/assets/audio/`

## Art

Runtime maps, characters, animals, buildings, interiors, crops, fish, props, and effects use GPT Image source artwork processed into pixel-aligned PNG assets. The source files, runtime files, hashes, and provenance are recorded under `public/assets/art-remaster-v1/`.

The five building interiors are `384x256`. Outdoor maps remain `512x352`. Transparent sprites use binary alpha and nearest-neighbor rendering.

## Development

```bash
npm install
npm run dev -- --port 4193
npm test
npm run lint
npm run build
python scripts/clean-sprite-mattes.py --check
```

Local game: `http://127.0.0.1:4193/`
