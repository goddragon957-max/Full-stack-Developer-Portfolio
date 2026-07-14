import type { Season, SeasonDate } from './seasonSystem';

export type Weather = 'sunny' | 'rain' | 'windy' | 'snow';

export type WeatherState = {
  version: 1;
  dateKey: string;
  weather: Weather;
  discoveredWeather: Weather[];
  lastRainAppliedDate: string | null;
};

export type WeatherAudioMix = {
  musicMultiplier: number;
  ambience: 'none' | 'rain' | 'wind' | 'snow';
  ambienceVolume: number;
};

export const WEATHER_STORAGE_KEY = 'mossbell-weather-v1';
export const WEATHER_SAVE_VERSION = 1;
export const WEATHER_TYPES: Weather[] = ['sunny', 'rain', 'windy', 'snow'];

export const WEATHER_INFO: Record<Weather, { label: string; icon: string; atlas: string }> = {
  sunny: { label: 'Sunny', icon: '/assets/seasons-v1/icons/weather-sunny.png', atlas: '/assets/seasons-v1/effects/weather-atlas.png' },
  rain: { label: 'Rain', icon: '/assets/seasons-v1/icons/weather-rain.png', atlas: '/assets/seasons-v1/effects/weather-atlas.png' },
  windy: { label: 'Windy', icon: '/assets/seasons-v1/icons/weather-windy.png', atlas: '/assets/seasons-v1/effects/weather-atlas.png' },
  snow: { label: 'Snow', icon: '/assets/seasons-v1/icons/weather-snow.png', atlas: '/assets/seasons-v1/effects/weather-atlas.png' },
};

const WEATHER_SEQUENCE: Record<Season, Weather[]> = {
  spring: ['sunny', 'rain', 'windy', 'rain', 'sunny', 'windy', 'rain'],
  summer: ['sunny', 'sunny', 'rain', 'windy', 'sunny', 'rain', 'windy'],
  autumn: ['windy', 'sunny', 'rain', 'windy', 'sunny', 'rain', 'windy'],
  winter: ['snow', 'sunny', 'windy', 'snow', 'sunny', 'snow', 'windy'],
};

const isWeather = (value: unknown): value is Weather => typeof value === 'string' && WEATHER_TYPES.includes(value as Weather);

export function getWeatherDateKey(date: SeasonDate) {
  return `y${date.year}-${date.season}-d${date.day}`;
}

export function getWeatherForDate(date: SeasonDate): Weather {
  const sequence = WEATHER_SEQUENCE[date.season];
  const yearOffset = Math.max(0, date.year - 1) % sequence.length;
  return sequence[(Math.max(1, date.day) - 1 + yearOffset) % sequence.length];
}

export function createInitialWeatherState(date: SeasonDate): WeatherState {
  const weather = getWeatherForDate(date);
  return {
    version: WEATHER_SAVE_VERSION,
    dateKey: getWeatherDateKey(date),
    weather,
    discoveredWeather: [weather],
    lastRainAppliedDate: null,
  };
}

export function normalizeWeatherState(value: unknown, date: SeasonDate): WeatherState {
  const fallback = createInitialWeatherState(date);
  if (!value || typeof value !== 'object') return fallback;
  const candidate = value as Partial<WeatherState>;
  if (candidate.version !== WEATHER_SAVE_VERSION) return fallback;
  const discoveredWeather = WEATHER_TYPES.filter((weather) => candidate.discoveredWeather?.includes(weather));
  if (isWeather(candidate.weather) && !discoveredWeather.includes(candidate.weather)) discoveredWeather.push(candidate.weather);
  return {
    version: WEATHER_SAVE_VERSION,
    dateKey: typeof candidate.dateKey === 'string' ? candidate.dateKey : fallback.dateKey,
    weather: isWeather(candidate.weather) ? candidate.weather : fallback.weather,
    discoveredWeather,
    lastRainAppliedDate: typeof candidate.lastRainAppliedDate === 'string' ? candidate.lastRainAppliedDate : null,
  };
}

export function syncWeatherState(state: WeatherState, date: SeasonDate): WeatherState {
  const dateKey = getWeatherDateKey(date);
  const weather = getWeatherForDate(date);
  const discoveredWeather = state.discoveredWeather.includes(weather)
    ? state.discoveredWeather
    : WEATHER_TYPES.filter((item) => [...state.discoveredWeather, weather].includes(item));
  if (state.dateKey === dateKey && state.weather === weather && discoveredWeather === state.discoveredWeather) return state;
  return { ...state, dateKey, weather, discoveredWeather };
}

export function loadWeatherState(date: SeasonDate): WeatherState {
  if (typeof window === 'undefined') return createInitialWeatherState(date);
  try {
    const saved = window.localStorage.getItem(WEATHER_STORAGE_KEY);
    return syncWeatherState(saved ? normalizeWeatherState(JSON.parse(saved), date) : createInitialWeatherState(date), date);
  } catch {
    return createInitialWeatherState(date);
  }
}

export function persistWeatherState(state: WeatherState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Weather persistence is optional for the active session.
  }
}

export function shouldApplyRain(state: WeatherState, date: SeasonDate) {
  const dateKey = getWeatherDateKey(date);
  return state.weather === 'rain' && state.dateKey === dateKey && state.lastRainAppliedDate !== dateKey;
}

export function markRainApplied(state: WeatherState, date: SeasonDate): WeatherState {
  return { ...state, lastRainAppliedDate: getWeatherDateKey(date) };
}

export function getWeatherAudioMix(weather: Weather): WeatherAudioMix {
  if (weather === 'rain') return { musicMultiplier: 0.72, ambience: 'rain' as const, ambienceVolume: 0.3 };
  if (weather === 'windy') return { musicMultiplier: 0.86, ambience: 'wind' as const, ambienceVolume: 0.16 };
  if (weather === 'snow') return { musicMultiplier: 0.68, ambience: 'snow' as const, ambienceVolume: 0.08 };
  return { musicMultiplier: 1, ambience: 'none' as const, ambienceVolume: 0 };
}

export const WEATHER_SYSTEM_MARKER = 'deterministic-date-weather';
