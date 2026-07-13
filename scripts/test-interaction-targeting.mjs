import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/components/MossbellFarmGame.tsx', import.meta.url), 'utf8');

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

console.log('interaction targeting test passed');
