import { readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const css = readFileSync('src/styles.css', 'utf8');
const game = readFileSync('src/components/MossbellFarmGame.tsx', 'utf8');

const dialogueRule = css.match(/\.dialogue-box\s*\{([\s\S]*?)\}/)?.[1] ?? '';
const openDialogueRule = css.match(/\.dialogue-box\.is-open\s*\{([\s\S]*?)\}/)?.[1] ?? '';
const openParagraphRule = css.match(/\.dialogue-box\.is-open p\s*\{([\s\S]*?)\}/)?.[1] ?? '';

assert(/overflow:\s*hidden/.test(dialogueRule), 'Bottom dialogue must not create an internal scrollbar');
assert(/padding:\s*10px/.test(openDialogueRule), 'Open dialogue must use compact viewport-safe padding');
assert(/font-size:\s*12px/.test(openParagraphRule), 'Open dialogue copy must fit the fixed bottom bar');
assert(/line-height:\s*1\.25/.test(openParagraphRule), 'Open dialogue lines must use compact leading');
assert(game.includes('data-scroll-policy="viewport-contained"'), 'Fullscreen game must declare its no-scroll layout policy');

console.log('viewport layout test passed: game shell and dialogue stay inside one screen without nested scrolling');
