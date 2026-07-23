import { readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const css = readFileSync('src/styles.css', 'utf8');
const game = readFileSync('src/components/MossbellFarmGame.tsx', 'utf8');

const dialogueRule = css.match(/\.dialogue-box\s*\{([\s\S]*?)\}/)?.[1] ?? '';
const openDialogueRule = css.match(/\.dialogue-box\.is-open\s*\{([\s\S]*?)\}/)?.[1] ?? '';
const openParagraphRule = css.match(/\.dialogue-box\.is-open p\s*\{([\s\S]*?)\}/)?.[1] ?? '';
const inventoryHeaderTitleRule = css.match(/\.inventory-header strong\s*\{([\s\S]*?)\}/)?.[1] ?? '';
const inventorySummaryRule = css.match(/\.inventory-summary\s*\{([\s\S]*?)\}/)?.[1] ?? '';
const inventoryTabRule = css.match(/\.inventory-tabs button\s*\{([\s\S]*?)\}/)?.[1] ?? '';
const inventoryDetailCopyRule = css.match(/\.inventory-detail p\s*\{([\s\S]*?)\}/)?.[1] ?? '';
const inventoryRailRule = css.match(/\.inventory-rail\s*\{([\s\S]*?)\}/)?.[1] ?? '';
const inventoryRailInnerRule = css.match(/\.inventory-rail-inner\s*\{([\s\S]*?)\}/)?.[1] ?? '';
const gameViewportRule = css.match(/\.game-viewport\s*\{([\s\S]*?)\}/)?.[1] ?? '';
const phaserHostRule = css.match(/\.phaser-game-host\s*\{([\s\S]*?)\}/)?.[1] ?? '';
const mobileInventoryInputRule = css.match(/\.mobile-inventory-toggle,\s*\.mobile-inventory-scrim,\s*\.mobile-inventory-close\s*\{([\s\S]*?)\}/)?.[1] ?? '';

assert(/overflow:\s*hidden/.test(dialogueRule), 'Bottom dialogue must not create an internal scrollbar');
assert(/padding:\s*10px/.test(openDialogueRule), 'Open dialogue must use compact viewport-safe padding');
assert(/font-size:\s*12px/.test(openParagraphRule), 'Open dialogue copy must fit the fixed bottom bar');
assert(/line-height:\s*1\.25/.test(openParagraphRule), 'Open dialogue lines must use compact leading');
assert(game.includes('data-scroll-policy="viewport-contained"'), 'Fullscreen game must declare its no-scroll layout policy');
assert(game.includes('function getDialogueBarHeight(viewport: ViewportSize, dialogueOpen: boolean)'), 'Dialogue height must switch between compact and open overlay states');
assert(game.includes('const DESKTOP_COLLAPSED_DIALOGUE_HEIGHT = 54;'), 'Desktop status bar must stay compact while dialogue is closed');
assert(game.includes('const MOBILE_COLLAPSED_DIALOGUE_HEIGHT = 52;'), 'Mobile status bar must stay compact while dialogue is closed');
assert(game.includes('const OPEN_DIALOGUE_HEIGHT = 128;'), 'Open dialogue must remain readable without shrinking the game canvas');
assert(game.includes("data-dialogue-height-mode=\"overlay-dynamic\""), 'Runtime diagnostics must identify the overlay dialogue contract');
assert(game.includes('data-camera-mode="fit-center"'), 'Runtime diagnostics must identify the fit-center camera mode that keeps the whole region visible');
assert(!game.includes('fixed-overview'), 'Game-first layout must not restore the whole-map fixed overview');
assert(game.includes('const DESKTOP_INVENTORY_CONTENT_WIDTH = 368;'), 'Desktop inventory content must remain capped at a readable 368px');
assert(game.includes('const DESKTOP_INVENTORY_RAIL_MIN = 320;'), 'Desktop inventory rail must remain readable without becoming a second game panel');
assert(game.includes('function getGameChromeLayout(viewport: ViewportSize, dialogueOpen: boolean)'), 'Game chrome must be independent of map aspect ratio');
assert(!game.includes('viewport.width - scaledWorldWidth'), 'Unused game width must not be absorbed by the inventory HUD');
assert(!game.includes('viewport.height - scaledWorldHeight'), 'Unused game height must not be absorbed by the dialogue bar');
assert(game.includes('data-inventory-rail-width={inventoryRailWidth}'), 'Runtime diagnostics must expose the responsive inventory width');
assert(game.includes('data-dialogue-bar-height={dialogueBarHeight}'), 'Runtime diagnostics must expose the responsive dialogue height');
assert(game.includes('data-phaser-edge-fit="fit-letterbox"'), 'Runtime diagnostics must identify fit rendering that letterboxes instead of cropping the region');
assert(game.includes('data-inventory-layout="single-column"'), 'Desktop HUD must remain a single column at every width');
assert(game.includes("data-inventory-mode={isMobileInventory ? 'overlay-drawer' : 'fixed-rail'}"), 'Runtime must expose mobile drawer and desktop rail modes');
assert(game.includes('data-mobile-inventory-open={mobileInventoryOpen ? \'true\' : \'false\'}'), 'Mobile inventory state must be browser-testable');
assert(game.includes('className="mobile-inventory-toggle"'), 'Mobile must provide an explicit inventory drawer button');
assert(game.includes('className="mobile-inventory-scrim"'), 'Open mobile inventory must block accidental world input');
assert(game.includes('className="inventory-rail-inner"'), 'Expanded right HUD must keep its controls in a bounded inner column');
assert(!game.includes('inventory-rail-status-column'), 'The obsolete wide HUD status column must be removed');
assert(!game.includes('inventory-rail-items-column'), 'The obsolete wide HUD item column must be removed');
assert(!game.includes('inventory-rail-objective-map'), 'The always-visible mini map must move back into the game menu');
assert(/overflow:\s*hidden/.test(inventoryRailRule), 'The outer inventory rail must contain its decorative extension');
assert(/width:\s*var\(--inventory-rail-width\)/.test(inventoryRailRule), 'The inventory rail must occupy only its measured layout column');
assert(/min-width:\s*var\(--inventory-rail-width\)/.test(inventoryRailRule), 'The inventory rail minimum width must match its measured layout column');
assert(/width:\s*100%/.test(inventoryRailInnerRule), 'Expanded inventory content must consume the full adaptive rail width');
assert(!css.includes('--phaser-gutter-cover'), 'Phaser edge alignment must not rely on HUD overdraw variables');
assert(/right:\s*var\(--inventory-rail-width\)/.test(dialogueRule), 'The dialogue bar must end exactly at the inventory edge');
assert(/height:\s*var\(--dialogue-bar-height\)/.test(dialogueRule), 'The dialogue bar must occupy only its measured layout row');
assert(/min-height:\s*var\(--dialogue-bar-height\)/.test(dialogueRule), 'The dialogue bar minimum height must match its measured layout row');
assert(/inset:\s*0 var\(--inventory-rail-width\) 0 0/.test(gameViewportRule), 'Game viewport must reserve only the desktop inventory rail');
assert(!/padding:[^;]*var\(--dialogue-bar-height\)/.test(gameViewportRule), 'Overlay dialogue must not reduce game viewport height');
assert(/inset:\s*0/.test(phaserHostRule), 'Phaser canvas must fill the complete game viewport behind dialogue');
assert(!css.includes('[data-inventory-layout="expanded"]'), 'Expanded two-column HUD CSS must be removed');
assert(css.includes('.mobile-inventory-toggle'), 'Mobile drawer toggle styles are required');
assert(css.includes('.mobile-inventory-scrim'), 'Mobile drawer scrim styles are required');
assert(css.includes('.inventory-rail.is-mobile-open'), 'Mobile inventory must have an explicit open state');
assert(/pointer-events:\s*auto/.test(mobileInventoryInputRule), 'Mobile inventory controls must receive pointer input through the game overlay');
assert(/font-size:\s*21px/.test(inventoryHeaderTitleRule), 'Inventory title must be prominent at desktop size');
assert(/font-size:\s*11px/.test(inventorySummaryRule), 'Inventory summary must remain readable');
assert(/font:[^;]*10px/.test(inventoryTabRule), 'Inventory tabs must use readable 10px labels');
assert(/font-size:\s*12\.5px/.test(inventoryDetailCopyRule), 'Inventory detail copy must use readable body text');

console.log('viewport layout test passed: game-first canvas, single-column HUD, overlay dialogue, and mobile inventory drawer');
