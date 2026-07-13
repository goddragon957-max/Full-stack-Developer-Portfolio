import { readFileSync } from 'node:fs';
import ts from 'typescript';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const compiled = ts.transpileModule(readFileSync('src/game/gameProgress.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  fileName: 'gameProgress.ts',
}).outputText;
const progress = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

const legacy = progress.normalizeGameProgress({
  version: 1,
  questStage: 'inspect-server-barn',
  harvestCount: 3,
  journal: ['모스벨 농가', '모스벨 농가', 42],
});
assert(legacy.questStage === 'inspect-barn', 'Legacy quest stages must migrate to pure in-world IDs');
assert(legacy.harvestCount === 3, 'Quest harvest progress must survive migration');
assert(JSON.stringify(legacy.journal) === JSON.stringify(['모스벨 농가']), 'Journal entries must normalize and deduplicate');

const invalid = progress.normalizeGameProgress({ version: 1, questStage: 'unknown', harvestCount: 99 });
assert(invalid.questStage === 'not-started' && invalid.harvestCount === 3, 'Invalid progress must recover safely');

console.log('game progress test passed: quest stage migration, harvest progress, and journal persistence normalize safely');
