import { readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const component = readFileSync('src/components/MossbellFarmGame.tsx', 'utf8');
const calendar = readFileSync('src/components/game/SeasonCalendarPanel.tsx', 'utf8');
const styles = readFileSync('src/styles.css', 'utf8');

assert(
  component.includes("type MenuTab = 'map' | 'calendar' | 'journal' | 'audio' | 'setup' | 'reset';"),
  'Game menu must expose dedicated MAP, CALENDAR, JOURNAL, AUDIO, SETUP, and RESET tabs',
);
assert(
  component.includes("const menuTabs: MenuTab[] = ['map', 'calendar', 'journal', 'audio', 'setup', 'reset'];"),
  'Game menu tab order must keep calendar beside the map and reset last',
);
assert(
  component.includes('<SeasonCalendarPanel')
    && calendar.includes('data-calendar-panel="season-planner"')
    && calendar.includes('data-calendar-day={day.day}')
    && calendar.includes('getWeatherForDate'),
  'Calendar must render a deterministic seven-day weather plan',
);
assert(
  component.includes('className="world-region-thumb"')
    && component.includes('getSeasonalMapAsset(region, seasonState.season)')
    && component.includes('className="mini-map-image"'),
  'Map must use the current GPT seasonal region art for thumbnails and the local map preview',
);
assert(
  component.includes('data-setup-panel="display-and-time"')
    && component.includes('data-reset-panel="isolated-game-resets"'),
  'Display and time controls must be separated from destructive reset actions',
);
assert(styles.includes('.calendar-panel'), 'Calendar panel styles are required');
assert(styles.includes('.world-region-thumb'), 'World region thumbnail styles are required');
assert(styles.includes('.setup-panel'), 'Setup panel styles are required');

console.log('game menu test passed: calendar, illustrated world map, setup, and isolated resets');
