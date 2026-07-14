# Mossbell Farm Verification

## Automated Checks

```bash
npm test
npm run lint
npm run build
python scripts/clean-sprite-mattes.py --check
```

`npm test` covers content markers, weather-aware audio mapping, the complete outdoor region loop, five building interiors, safe arrivals, room collisions, persistence normalization, economy purchases, quality-aware shipping, inventory deduction, tool progression, four seven-day seasons, deterministic weather, automatic rain watering, seasonal fishing pools, and annual festival rewards.

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
11. Buy a seed and feed, confirm GOLD and stock change once, and plant one purchased seed.
12. Ship one quality crop, remove and re-add it on the same day, then REST and confirm GOLD, inventory deduction, DAY EARNINGS, and the itemized receipt.
13. Upgrade all three tool types and confirm watering area, fishing bite window, mining bonus, level caps, and milestone persistence.
14. Advance Winter 7 to Spring 1 and confirm the year increments once; forced DAY/NIGHT must not advance the date.
15. Plant a crop before a rainy date and confirm it becomes watered without increasing the manual watering streak.
16. Catch one season-specific fish in its matching region and season.
17. Complete Harvest Night and Starlight Festival, reload, and confirm each souvenir remains limited to once per year.
18. Open the shipping box and confirm exactly three daily demand items with a `+20%` unit-price bonus.

## Asset Contracts

- Outdoor maps: `512x352`
- Building interiors: `384x256`
- Hana and Jun cottage sprites: `128x128`, binary alpha
- All runtime sprites: nearest-neighbor, transparent corners, no white matte
- GPT Image provenance and hashes: `public/assets/art-remaster-v1/manifest.json`
- Economy sprites: GPT Image source sheet with transparent shipping box, coin, seed, feed, and upgrade outputs
- Seasons v1: 18 GPT sources, 16 `512x352` seasonal region maps, and 17 binary-alpha runtime assets with manifest hashes
