# Mossbell Farm Verification

## Automated Checks

```bash
npm test
npm run lint
npm run build
python scripts/clean-sprite-mattes.py --check
```

`npm test` covers content markers, audio mapping, the complete outdoor region loop, five building interiors, safe arrivals, room collisions, persistence normalization, and game-only copy.

## Runtime Checks

Run the game at `http://127.0.0.1:4193/` and verify:

1. Start with Enter, Space, `E`, or the start button.
2. Enter and leave the farmhouse, seed shop, barn, Hana's cottage, and Jun's cottage.
3. Use the farmhouse bed and confirm the next day begins.
4. Travel Farm Village to Whisper Forest to River Coast to Mine Foothill and back to Farm Village.
5. Confirm transition fades, safe arrival positions, and no blocked exit lanes.
6. Harvest a crop, care for an animal, catch a fish, collect forage, and mine an ore node.
7. Refresh inside a building and outside in another region; confirm location and persistent progress restore.
8. Check MAP, JOURNAL, SETTINGS, and all four inventory tabs.
9. Check desktop `1440x900` and mobile `390x844` for overlap and horizontal scrolling.
10. Confirm browser console errors remain at zero.

## Asset Contracts

- Outdoor maps: `512x352`
- Building interiors: `384x256`
- Hana and Jun cottage sprites: `128x128`, binary alpha
- All runtime sprites: nearest-neighbor, transparent corners, no white matte
- GPT Image provenance and hashes: `public/assets/art-remaster-v1/manifest.json`
