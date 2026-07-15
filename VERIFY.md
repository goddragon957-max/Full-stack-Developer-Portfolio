# Mossbell Farm Verification

## Automated Checks

```bash
npm test
npm run lint
npm run build
python scripts/clean-sprite-mattes.py --check
```

`npm test` covers content markers, weather-aware audio mapping, the complete outdoor region loop, mine cliff collision and trapped-save recovery, five building interiors, safe arrivals, room collisions, persistence normalization, expandable `5x4` farming, free shoreline casting, economy purchases, quality-aware shipping, inventory deduction, tool progression, four seven-day seasons, deterministic weather, automatic rain watering, seasonal fishing pools, annual festival rewards, and the complete prologue-to-finale story state machine.

## Runtime Checks

Run the game at `http://127.0.0.1:4193/` and verify:

1. Start with Enter, Space, `E`, or the start button.
2. Enter and leave the farmhouse, seed shop, barn, Hana's cottage, and Jun's cottage.
3. Use the farmhouse bed and confirm the next day begins.
4. Travel Farm Village to Whisper Forest to River Coast to Mine Foothill and back to Farm Village.
5. Confirm transition fades, safe arrival positions, and no blocked exit lanes.
6. Harvest a crop, care for an animal, catch a fish, collect forage, and mine an ore node.
7. Refresh inside a building and outside in another region; confirm location and persistent progress restore.
8. Check MAP, CALENDAR, JOURNAL, AUDIO, SETUP, RESET, and all four inventory tabs.
9. Confirm MAP thumbnails and the local preview use the active seasonal region art; undiscovered regions remain obscured.
10. Confirm CALENDAR shows exactly seven days, one current day, deterministic weather, and the matching seasonal festival.
11. Check desktop `1440x900` and mobile `390x844` for overlap and horizontal scrolling.
12. Confirm browser console errors remain at zero.
13. Buy a seed and feed, confirm GOLD and stock change once, and plant one purchased seed.
14. Ship one quality crop, remove and re-add it on the same day, then REST and confirm GOLD, inventory deduction, DAY EARNINGS, and the itemized receipt.
15. Upgrade all three tool types and confirm watering area, fishing bite window, mining bonus, level caps, and milestone persistence.
16. Advance Winter 7 to Spring 1 and confirm the year increments once; forced DAY/NIGHT must not advance the date.
17. Plant a crop before a rainy date and confirm it becomes watered without increasing the manual watering streak.
18. Select the fishing rod anywhere along a pond, river, or coast bank; face the water, cast without a fixed fishing-zone marker, and catch one season-specific fish.
19. Complete Harvest Night and Starlight Festival, reload, and confirm each souvenir remains limited to once per year.
20. Open the shipping box and confirm exactly three daily demand items with a `+20%` unit-price bonus.
21. Read the faded mailbox letter, talk to Lumi, and inspect the old village bell; confirm the prologue cutscene can be skipped.
22. Open JOURNAL and confirm MAIN STORY shows four seal slots, checked objectives, and one next destination.
23. Open MAP and CALENDAR; confirm the active destination highlight and four seasonal bell markers are visible without covering existing content.
24. Complete the spring, summer, autumn, and winter action sets in order; confirm only post-activation actions count and each seal is awarded once.
25. Return all four seals to the old bell; confirm the finale, `MOSSBELL KEEPER` record, and bell keepsake persist after refresh without duplicate rewards.
26. Select the hoe, walk toward an empty cell beside the original six plots, confirm FARM MODE holds the player at the edge, and press `E` to create a seventh tilled plot.
27. Refresh and continue; confirm the added plot remains, then inspect Spring, Summer, Autumn, and Winter to confirm the ranch gate stays rectangular with a straight top.
28. In Mine Foothill, confirm the three enclosed cliff terraces reject movement while the west path, central route, upper mining ground, five nodes, and south exit remain reachable.

## Asset Contracts

- Outdoor maps: `512x352`
- Building interiors: `384x256`
- Hana and Jun cottage sprites: `128x128`, binary alpha
- All runtime sprites: nearest-neighbor, transparent corners, no white matte
- GPT Image provenance and hashes: `public/assets/art-remaster-v1/manifest.json`
- Economy sprites: GPT Image source sheet with transparent shipping box, coin, seed, feed, and upgrade outputs
- Seasons v1: 22 GPT sources, 16 `512x352` seasonal region maps, and 17 binary-alpha runtime assets with manifest hashes
- Story v1: 7 independent GPT Image sources and 7 binary-alpha runtime assets with hashes in `public/assets/story-v1/manifest.json`
- Story asset processing is limited to chroma removal, alpha crop, nearest-neighbor resize, and validation by `scripts/process-gpt-story-assets.py`
