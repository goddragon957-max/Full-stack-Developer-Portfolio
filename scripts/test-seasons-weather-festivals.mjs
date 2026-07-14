import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function loadTypeScript(path, transform = (source) => source) {
  assert(existsSync(path), `${path} must exist`);
  const compiled = ts.transpileModule(transform(readFileSync(path, 'utf8')), {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
    fileName: path,
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
}

const season = await loadTypeScript('src/game/seasonSystem.ts');
const weather = await loadTypeScript('src/game/weatherSystem.ts');
const festival = await loadTypeScript('src/game/festivalSystem.ts');

const expectedDates = [
  [1, 1, 'spring', 1],
  [7, 1, 'spring', 7],
  [8, 1, 'summer', 1],
  [15, 1, 'autumn', 1],
  [22, 1, 'winter', 1],
  [28, 1, 'winter', 7],
  [29, 2, 'spring', 1],
];
for (const [villageDay, year, expectedSeason, day] of expectedDates) {
  const date = season.getSeasonDate(villageDay);
  assert(date.year === year && date.season === expectedSeason && date.day === day, `Village day ${villageDay} must become Y${year} ${expectedSeason} ${day}`);
}

let seasonState = season.createInitialSeasonState(1);
seasonState = season.syncSeasonState(seasonState, 8);
assert(seasonState.season === 'summer' && seasonState.discoveredSeasons.includes('summer'), 'Season sync must discover summer without losing spring');
seasonState = season.syncSeasonState(seasonState, 29);
assert(seasonState.year === 2 && seasonState.season === 'spring' && seasonState.day === 1, 'Winter 7 must roll into a new spring year');
const demands = season.getDailyDemandItems(seasonState);
assert(demands.length === 3 && new Set(demands).size === 3, 'Each date must expose exactly three unique demand items');
assert(JSON.stringify(demands) === JSON.stringify(season.getDailyDemandItems(seasonState)), 'Daily demand must be deterministic');
assert(season.getCropGrowthMultiplier('tomato', 'summer') === 1, 'Preferred-season crops must use normal growth timing');
assert(season.getCropGrowthMultiplier('tomato', 'winter') > 1, 'Non-preferred crops must grow slightly slower');
assert(season.getCropSeasonQualityBonus('tomato', 'summer') > 0, 'Preferred crops must receive a small quality bonus');

const yearlyWeather = season.SEASONS.flatMap((seasonName) => Array.from({ length: 7 }, (_, index) => {
  const date = { year: 1, season: seasonName, day: index + 1 };
  const first = weather.getWeatherForDate(date);
  const second = weather.getWeatherForDate(date);
  assert(first === second, `Weather must be deterministic for ${seasonName} ${index + 1}`);
  if (first === 'snow') assert(seasonName === 'winter', 'Snow must only occur in winter');
  return first;
}));
assert(yearlyWeather.includes('sunny') && yearlyWeather.includes('rain') && yearlyWeather.includes('windy') && yearlyWeather.includes('snow'), 'A full year must exercise all four weather types');

let weatherState = weather.createInitialWeatherState({ year: 1, season: 'spring', day: 1 });
weatherState = weather.syncWeatherState(weatherState, { year: 1, season: 'summer', day: 2 });
assert(weatherState.weather === weather.getWeatherForDate({ year: 1, season: 'summer', day: 2 }), 'Weather state must follow the calendar date');
const markedRain = weather.markRainApplied(weatherState, { year: 1, season: 'summer', day: 2 });
assert(!weather.shouldApplyRain(markedRain, { year: 1, season: 'summer', day: 2 }), 'Rain watering must be idempotent for one date');

const farm = await loadTypeScript('src/game/farmLoop.ts', (raw) => {
  const withoutImport = raw.replace(/import \{ CROP_SPRITES, SOIL_SPRITES, TOOL_SPRITES \} from '\.\/animationCatalog';/, '');
  return `const CROP_SPRITES = new Proxy({}, { get: () => new Proxy({}, { get: () => '' }) });\nconst SOIL_SPRITES = { untilled: '', tilled: '', watered: '' };\nconst TOOL_SPRITES = { hoe: '', seeds: '', 'watering-can': '' };\n${withoutImport}`;
});
const plantedFarm = farm.createInitialFarmState();
plantedFarm.plots[0] = { ...plantedFarm.plots[0], crop: 'potato', stage: 'planted', wateredAt: null };
plantedFarm.plots[1] = { ...plantedFarm.plots[1], crop: 'tomato', stage: 'growing-1', wateredAt: 10 };
const rainedFarm = farm.waterAllPlantedPlots(plantedFarm, 1_000);
assert(rainedFarm.changed && rainedFarm.state.plots[0].stage === 'watered', 'Rain must water newly planted crops');
assert(rainedFarm.state.plots[1].wateredAt === 10, 'Rain must not reset an already growing crop timer');

const fishing = await loadTypeScript('src/game/fishingLoop.ts', (raw) => {
  const withoutImports = raw
    .replace(/import type \{ RegionId \} from '\.\/openWorld';/, '')
    .replace(/import type \{ DayPhase \} from '\.\/villagePulse';/, '')
    .replace(/import \{ FISH_SPRITES \} from '\.\/animationCatalog';/, '');
  return `const FISH_SPRITES = new Proxy({}, { get: (_, key) => String(key) });\n${withoutImports}`;
});
const seasonalFish = ['blossom-dace', 'sunscale-bass', 'ember-carp', 'frostfin'];
for (const fishId of seasonalFish) assert(fishing.FISH_IDS.includes(fishId), `${fishId} must be in the fishing catalog`);
assert(fishing.getFishingPool(false, 'river', 'spring').includes('blossom-dace'), 'Spring river pool must include blossom dace');
assert(!fishing.getFishingPool(false, 'river', 'winter').includes('blossom-dace'), 'Season fish must not leak into other seasons');

assert(festival.getActiveFestival({ year: 1, season: 'autumn', day: 7 })?.id === 'harvest-night', 'Autumn 7 must host Harvest Night');
assert(festival.getActiveFestival({ year: 1, season: 'winter', day: 7 })?.id === 'starlight-festival', 'Winter 7 must host Starlight Festival');
assert(festival.getActiveFestival({ year: 1, season: 'summer', day: 7 }) === null, 'Other season endings must not create a festival');
let festivalState = festival.createInitialFestivalState();
const firstFestival = festival.completeFestival(festivalState, 'harvest-night', 1);
assert(firstFestival.changed && firstFestival.rewardId === 'harvest-ribbon', 'First annual festival completion must grant its souvenir');
festivalState = firstFestival.state;
assert(!festival.completeFestival(festivalState, 'harvest-night', 1).changed, 'The same festival must not reward twice in one year');
assert(festival.completeFestival(festivalState, 'harvest-night', 2).changed, 'A new year must allow the festival reward again');

const game = readFileSync('src/components/MossbellFarmGame.tsx', 'utf8');
const festivalSource = readFileSync('src/game/festivalSystem.ts', 'utf8');
for (const marker of [
  'data-season-system="v1"',
  'data-weather-system="v1"',
  'data-festival-system="v1"',
  'data-season-date',
  'data-today-weather',
  'data-season-demand-count="3"',
]) {
  assert(game.includes(marker), `Runtime integration marker missing: ${marker}`);
}
for (const label of ['HARVEST NIGHT', 'STARLIGHT FESTIVAL']) {
  assert(festivalSource.includes(label), `Festival domain label missing: ${label}`);
}

assert(existsSync('public/assets/seasons-v1/manifest.json'), 'Season GPT asset manifest must exist');
const manifest = JSON.parse(readFileSync('public/assets/seasons-v1/manifest.json', 'utf8'));
assert(manifest.generation?.model === 'gpt-image', 'Season assets must declare GPT Image provenance');
assert(manifest.maps?.length === 16, 'Four regions need four seasonal GPT map variants each');
assert(manifest.assets?.length >= 9, 'Season icons, weather atlas, fish, and festival props must be cataloged');
assert([...manifest.maps, ...manifest.assets, ...manifest.sources].every((entry) => entry.sha256), 'Every season source and output must include a SHA-256 hash');

console.log('seasons/weather/festivals test passed: calendar, deterministic weather, rain, seasonal fish, annual festivals, runtime, and GPT assets');
