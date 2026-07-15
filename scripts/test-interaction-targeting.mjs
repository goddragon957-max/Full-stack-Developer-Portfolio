import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/components/MossbellFarmGame.tsx', import.meta.url), 'utf8');
const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');

assert.match(source, /function facingPriority\(/, 'interaction targeting should account for the player facing direction');
assert.match(
  source,
  /a\.distance - b\.distance \|\| facingPriority\(player, a\.entity\) - facingPriority\(player, b\.entity\)/,
  'equidistant interactions should prefer the entity in front of the player',
);
assert.match(
  source,
  /journal\.map<JournalEntry>\(\(title\) => \(\{ id: `entity-\$\{title\}`/,
  'interior discovery keys should include the location-specific journal title',
);
assert.match(
  source,
  /const fishingHasPriority = fishingRodSelected \|\| fishingSession\.status !== 'idle';/,
  'fishing should only preempt nearby gathering when the rod is selected or a cast is active',
);
assert.match(
  source,
  /fishingHasPriority && interactWithFishing\(\)[\s\S]*interactWithNearbyForage\(\)[\s\S]*const target = nearby/,
  'the selected fishing rod should own E while ordinary gathering remains reachable without it',
);
assert.match(source, /data-forage-action-hint=/, 'nearby forage should render a readable world action label');
assert.match(source, /data-interaction-focus=\{interactionFocus\}/, 'the HUD should expose the same interaction priority used by E');
assert.match(css, /\.forage-action-hint\s*\{/, 'forage action label must have explicit readable styling');

console.log('interaction targeting test passed');
