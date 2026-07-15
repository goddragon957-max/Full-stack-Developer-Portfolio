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

assert(/overflow:\s*hidden/.test(dialogueRule), 'Bottom dialogue must not create an internal scrollbar');
assert(/padding:\s*10px/.test(openDialogueRule), 'Open dialogue must use compact viewport-safe padding');
assert(/font-size:\s*12px/.test(openParagraphRule), 'Open dialogue copy must fit the fixed bottom bar');
assert(/line-height:\s*1\.25/.test(openParagraphRule), 'Open dialogue lines must use compact leading');
assert(game.includes('data-scroll-policy="viewport-contained"'), 'Fullscreen game must declare its no-scroll layout policy');
assert(game.includes('function getDialogueBarHeight(viewport: ViewportSize)'), 'Dialogue height must not depend on whether dialogue is open');
assert(!game.includes('if (!dialogueOpen)'), 'Opening dialogue must not resize the game viewport');
assert(game.includes("data-dialogue-height-mode=\"fixed\""), 'Runtime diagnostics must identify the stable dialogue bar');
assert(game.includes("isFixedOverviewCamera(viewport) ? 'fixed-overview' : 'player-follow'"), 'Desktop must use a fixed overview while narrow screens retain follow mode');
assert(game.includes('const fixedOverview = isFixedOverviewCamera(viewport);'), 'Camera layout must branch explicitly between fixed and follow modes');
assert(game.includes('const DESKTOP_INVENTORY_CONTENT_WIDTH = 368;'), 'Desktop inventory content must remain capped at a readable 368px');
assert(game.includes('const DESKTOP_INVENTORY_RAIL_MIN = 280;'), 'Compact desktop inventory rail must retain at least 280px');
assert(game.includes('function getGameChromeLayout(viewport: ViewportSize, scene: SceneId)'), 'Desktop chrome must derive its dimensions from the active map aspect ratio');
assert(game.includes('Math.max(baseRailWidth, viewport.width - scaledWorldWidth)'), 'Unused horizontal map space must be absorbed by the right HUD');
assert(game.includes('Math.max(baseDialogueHeight, viewport.height - scaledWorldHeight)'), 'Unused vertical map space must be absorbed by the dialogue bar');
assert(game.includes('getWorldCameraStyle(player, viewport, scene, inventoryRailWidth, dialogueBarHeight)'), 'Camera sizing must use the same adaptive chrome dimensions as the layout');
assert(game.includes('data-inventory-rail-width={inventoryRailWidth}'), 'Runtime diagnostics must expose the responsive inventory width');
assert(game.includes('data-dialogue-bar-height={dialogueBarHeight}'), 'Runtime diagnostics must expose the responsive dialogue height');
assert(game.includes('data-phaser-edge-fit="camera-origin-aligned"'), 'Runtime diagnostics must identify direct Phaser edge alignment');
assert(game.includes("data-inventory-layout={isExpandedInventoryRail ? 'expanded' : 'compact'}"), 'Runtime must explicitly select expanded HUD layout on very wide rails');
assert(game.includes('className="inventory-rail-inner"'), 'Expanded right HUD must keep its controls in a bounded inner column');
assert(game.includes('className="inventory-rail-status-column"'), 'Wide HUD must group player status and tools into a dedicated column');
assert(game.includes('className="inventory-rail-items-column"'), 'Wide HUD must group inventory and records into a dedicated column');
assert(game.includes('className="inventory-rail-objective-map"'), 'Expanded objective space must contain the live mini map instead of a blank panel');
assert(/overflow:\s*hidden/.test(inventoryRailRule), 'The outer inventory rail must contain its decorative extension');
assert(/width:\s*var\(--inventory-rail-width\)/.test(inventoryRailRule), 'The inventory rail must occupy only its measured layout column');
assert(/min-width:\s*var\(--inventory-rail-width\)/.test(inventoryRailRule), 'The inventory rail minimum width must match its measured layout column');
assert(/width:\s*100%/.test(inventoryRailInnerRule), 'Expanded inventory content must consume the full adaptive rail width');
assert(!css.includes('--phaser-gutter-cover'), 'Phaser edge alignment must not rely on HUD overdraw variables');
assert(/right:\s*var\(--inventory-rail-width\)/.test(dialogueRule), 'The dialogue bar must end exactly at the inventory edge');
assert(/height:\s*var\(--dialogue-bar-height\)/.test(dialogueRule), 'The dialogue bar must occupy only its measured layout row');
assert(/min-height:\s*var\(--dialogue-bar-height\)/.test(dialogueRule), 'The dialogue bar minimum height must match its measured layout row');
assert(css.includes('.farm-game[data-inventory-layout="expanded"] .inventory-rail-inner'), 'Very wide rails must use an explicit two-column HUD contract');
assert(css.includes('grid-template-columns: minmax(280px, 1fr) var(--inventory-content-width);'), 'Wide HUD must reserve a stable inventory column beside the flexible status column');
assert(css.includes('grid-template-rows: auto minmax(0, 1fr);'), 'Wide HUD must give remaining height to quest content instead of an empty status panel');
assert(css.includes('.farm-game[data-inventory-layout="expanded"] .inventory-rail-objective'), 'Wide HUD must stretch its objective panel into the remaining status-column space');
assert(css.includes('.farm-game[data-inventory-layout="expanded"] .inventory-rail-objective-map'), 'The live mini map must be visible only when the objective column has enough room');
assert(/font-size:\s*21px/.test(inventoryHeaderTitleRule), 'Inventory title must be prominent at desktop size');
assert(/font-size:\s*11px/.test(inventorySummaryRule), 'Inventory summary must remain readable');
assert(/font:[^;]*10px/.test(inventoryTabRule), 'Inventory tabs must use readable 10px labels');
assert(/font-size:\s*12\.5px/.test(inventoryDetailCopyRule), 'Inventory detail copy must use readable body text');

console.log('viewport layout test passed: fixed dialogue height, readable inventory rail, stable desktop overview, and viewport-contained UI');
