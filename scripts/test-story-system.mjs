import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function loadTypeScript(path) {
  assert(existsSync(path), `${path} must exist`);
  const compiled = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
    fileName: path,
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
}

const story = await loadTypeScript('src/game/storySystem.ts');

let state = story.createInitialStoryState();
assert(state.version === story.STORY_SAVE_VERSION, 'New story saves must use the current version');
assert(state.chapters.prologue === 'available', 'The prologue must be available in a new game');
for (const chapter of ['spring', 'summer', 'autumn', 'winter', 'finale']) {
  assert(state.chapters[chapter] === 'locked', `${chapter} must start locked`);
}
assert(state.seals.length === 0 && !state.endingComplete, 'A new game must not own seals or the ending reward');

const ignoredOwnedHarvest = story.applyStoryEvent(state, {
  type: 'crop-harvest', actionId: 'old-inventory-does-not-count', crop: 'potato', quality: 'gold', season: 'spring',
});
assert(!ignoredOwnedHarvest.changed, 'Actions must not count before their chapter is active');

let result = story.applyStoryEvent(state, { type: 'mailbox-read', actionId: 'letter-1' });
state = result.state;
assert(state.chapters.prologue === 'active' && state.progress.letterRead, 'Reading the faded letter must activate the prologue');
result = story.applyStoryEvent(state, { type: 'npc-talk', actionId: 'lumi-1', npc: 'lumi' });
state = result.state;
assert(state.progress.lumiBriefed, 'Talking to Lumi must advance the prologue');
result = story.applyStoryEvent(state, { type: 'bell-inspect', actionId: 'bell-prologue-1' });
state = result.state;
assert(state.chapters.prologue === 'complete' && state.chapters.spring === 'available', 'Inspecting the bell after Lumi must complete the prologue');
assert(result.cutscene === 'prologue', 'Completing the prologue must request its short cutscene');

const beforeHana = story.applyStoryEvent(state, {
  type: 'crop-harvest', actionId: 'spring-too-early', crop: 'potato', quality: 'silver', season: 'spring',
});
assert(!beforeHana.changed, 'Spring harvests must not count until Hana starts the chapter');
state = story.applyStoryEvent(state, { type: 'npc-talk', actionId: 'hana-1', npc: 'hana' }).state;
assert(state.chapters.spring === 'active', 'Hana must activate the spring chapter');
state = story.applyStoryEvent(state, {
  type: 'crop-harvest', actionId: 'spring-crop-1', crop: 'potato', quality: 'normal', season: 'spring',
}).state;
const duplicateSpring = story.applyStoryEvent(state, {
  type: 'crop-harvest', actionId: 'spring-crop-1', crop: 'potato', quality: 'normal', season: 'spring',
});
assert(!duplicateSpring.changed && duplicateSpring.state.progress.springHarvests === 1, 'The same action id must never count twice');
state = story.applyStoryEvent(state, {
  type: 'crop-harvest', actionId: 'spring-crop-2', crop: 'strawberry', quality: 'silver', season: 'spring',
}).state;
state = story.applyStoryEvent(state, {
  type: 'forage-collected', actionId: 'spring-herb-1', item: 'herb', region: 'whisper-forest', season: 'spring',
}).state;
result = story.applyStoryEvent(state, {
  type: 'crop-harvest', actionId: 'spring-crop-3', crop: 'carrot', quality: 'gold', season: 'spring',
});
state = result.state;
assert(state.chapters.spring === 'complete' && state.seals.includes('sprout'), 'Three real spring crop harvests plus the forest herb must award the sprout seal');
assert(result.sealAwarded === 'sprout' && result.cutscene === 'spring-seal', 'The spring completion result must request one seal cutscene');

state = story.applyStoryEvent(state, { type: 'npc-talk', actionId: 'sera-1', npc: 'sera' }).state;
assert(state.chapters.summer === 'active', 'Sera must activate the summer chapter');
const wrongFish = story.applyStoryEvent(state, {
  type: 'fish-caught', actionId: 'wrong-summer-fish', fish: 'river-trout', region: 'river-coast', season: 'summer',
});
assert(!wrongFish.changed, 'A normal fish must not satisfy the summer-only fish objective');
state = story.applyStoryEvent(state, {
  type: 'fish-caught', actionId: 'summer-fish-1', fish: 'sunscale-bass', region: 'river-coast', season: 'summer',
}).state;
state = story.applyStoryEvent(state, {
  type: 'forage-collected', actionId: 'summer-forage-1', item: 'wild-berry', region: 'river-coast', season: 'summer',
}).state;
state = story.applyStoryEvent(state, {
  type: 'ore-mined', actionId: 'summer-ore-1', item: 'iron-ore', region: 'mine-foothill', season: 'summer',
}).state;
result = story.applyStoryEvent(state, { type: 'water-marker-restored', actionId: 'water-marker-1', season: 'summer' });
state = result.state;
assert(state.chapters.summer === 'complete' && state.seals.includes('tide'), 'Restoring the marker after three real summer actions must award the tide seal');

state = story.applyStoryEvent(state, { type: 'npc-talk', actionId: 'jun-1', npc: 'jun' }).state;
assert(state.chapters.autumn === 'active', 'Jun must activate the autumn chapter');
const normalHarvest = story.applyStoryEvent(state, {
  type: 'crop-harvest', actionId: 'autumn-normal-1', crop: 'pumpkin', quality: 'normal', season: 'autumn',
});
assert(!normalHarvest.changed, 'Normal crops must not count toward the silver-or-better autumn objective');
for (const [index, quality] of ['silver', 'gold', 'silver'].entries()) {
  state = story.applyStoryEvent(state, {
    type: 'crop-harvest', actionId: `autumn-quality-${index}`, crop: index === 1 ? 'corn' : 'pumpkin', quality, season: 'autumn',
  }).state;
}
state = story.applyStoryEvent(state, {
  type: 'shipment-settled', actionId: 'autumn-shipment-1', season: 'autumn',
  lines: [{ itemId: 'crop:pumpkin:silver', quantity: 1 }],
}).state;
result = story.applyStoryEvent(state, {
  type: 'festival-complete', actionId: 'harvest-night-y1', festival: 'harvest-night', season: 'autumn', year: 1,
});
state = result.state;
assert(state.chapters.autumn === 'complete' && state.seals.includes('harvest'), 'Harvest Night after quality harvests and shipping must award the harvest seal');

state = story.applyStoryEvent(state, { type: 'npc-talk', actionId: 'doyun-1', npc: 'doyun' }).state;
assert(state.chapters.winter === 'active', 'Doyun must activate the winter chapter');
state = story.applyStoryEvent(state, {
  type: 'ore-mined', actionId: 'winter-crystal-1', item: 'star-crystal', region: 'mine-foothill', season: 'winter',
}).state;
result = story.applyStoryEvent(state, {
  type: 'festival-complete', actionId: 'starlight-y1', festival: 'starlight-festival', season: 'winter', year: 1,
});
state = result.state;
assert(state.chapters.winter === 'complete' && state.seals.includes('starlight'), 'Starlight Festival after mining a rare crystal must award the starlight seal');
assert(state.chapters.finale === 'available', 'Four completed season chapters must unlock the finale');

result = story.applyStoryEvent(state, { type: 'bell-inspect', actionId: 'bell-finale-1' });
state = result.state;
assert(state.chapters.finale === 'complete' && state.endingComplete, 'Installing four seals at the bell must complete the ending');
assert(result.rewardAwarded === 'bell-keepsake' && result.cutscene === 'finale', 'The finale must award the bell keepsake and request the finale cutscene');
assert(state.records.includes('MOSSBELL KEEPER') && state.rewards.includes('bell-keepsake'), 'The finale record and keepsake must persist in story state');
const duplicateFinale = story.applyStoryEvent(state, { type: 'bell-inspect', actionId: 'bell-finale-2' });
assert(!duplicateFinale.changed && !duplicateFinale.rewardAwarded, 'The finale reward must never be granted twice');

const migrated = story.normalizeStoryState({
  version: 0,
  chapters: { prologue: 'complete', spring: 'active' },
  progress: { letterRead: true, lumiBriefed: true, springHarvests: 2 },
  seals: ['sprout', 'unknown'],
  processedActionIds: ['old-action'],
});
assert(migrated.version === story.STORY_SAVE_VERSION, 'Older or partial story saves must migrate to the current version');
assert(migrated.chapters.prologue === 'complete' && migrated.chapters.spring === 'active', 'Migration must preserve valid chapter progress');
assert(migrated.seals.length === 1 && migrated.seals[0] === 'sprout', 'Migration must sanitize seal ids without resetting valid progress');

const finaleView = story.getStoryChapterView(state);
assert(finaleView.chapterId === 'finale' && finaleView.objectives.every((objective) => objective.complete), 'Journal view data must expose a completed finale');
assert(story.getStoryCalendarMarkers().length === 4, 'Calendar must expose exactly four seasonal story markers');
assert(story.STORY_CUTSCENES.finale.asset === story.STORY_ASSETS.oldBell, 'The finale must show the restored village bell, not the inventory keepsake');
assert(Object.values(story.STORY_CUTSCENES).every((scene) => scene.durationMs < 8_000), 'Every story cutscene must stay under eight seconds');

const game = readFileSync('src/components/MossbellFarmGame.tsx', 'utf8');
const calendar = readFileSync('src/components/game/SeasonCalendarPanel.tsx', 'utf8');
for (const marker of ['data-story-system="v1"', 'data-story-chapter', 'data-story-destination', 'STORY_STORAGE_KEY', 'applyStoryEvent']) {
  assert(game.includes(marker), `Runtime story integration marker missing: ${marker}`);
}
for (const marker of ['storyMarkers', 'calendar-story-bell', 'calendar-story-agenda']) {
  assert(calendar.includes(marker), `Calendar story marker integration missing: ${marker}`);
}

assert(existsSync('public/assets/story-v1/manifest.json'), 'Story GPT asset manifest must exist');
const manifest = JSON.parse(readFileSync('public/assets/story-v1/manifest.json', 'utf8'));
assert(manifest.generation?.model === 'gpt-image', 'Story assets must declare GPT Image provenance');
assert(manifest.assets?.length === 7, 'The old bell, letter, four seals, and keepsake must be cataloged');
assert([...manifest.sources, ...manifest.assets].every((entry) => entry.sha256), 'Every story source and runtime asset must include a SHA-256 hash');

console.log('story system test passed: action-gated chapters, four seals, idempotent finale, migration, UI markers, and GPT assets');
