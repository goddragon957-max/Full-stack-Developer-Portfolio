import { CalendarDays, CheckCircle2 } from 'lucide-react';
import { FARM_CROPS, FARM_CROP_INFO } from '../../game/farmLoop';
import {
  FESTIVAL_INFO,
  hasCompletedFestival,
  type FestivalState,
} from '../../game/festivalSystem';
import {
  SEASONS,
  SEASON_INFO,
  getCropPreferredSeason,
  type SeasonState,
} from '../../game/seasonSystem';
import {
  WEATHER_INFO,
  getWeatherForDate,
  type WeatherState,
} from '../../game/weatherSystem';
import { STORY_ASSETS, type StoryCalendarMarker } from '../../game/storySystem';

type SeasonCalendarPanelProps = {
  seasonState: SeasonState;
  weatherState: WeatherState;
  festivalState: FestivalState;
  storyMarkers: StoryCalendarMarker[];
};

export function SeasonCalendarPanel({ seasonState, weatherState, festivalState, storyMarkers }: SeasonCalendarPanelProps) {
  const calendarDays = Array.from({ length: 7 }, (_, index) => {
    const day = index + 1;
    const weather = getWeatherForDate({ year: seasonState.year, season: seasonState.season, day });
    const festival = Object.values(FESTIVAL_INFO).find(
      (entry) => entry.season === seasonState.season && entry.day === day,
    ) ?? null;
    const story = storyMarkers.find((entry) => entry.season === seasonState.season && entry.day === day) ?? null;
    return { day, weather, festival, story };
  });
  const seasonFestival = Object.values(FESTIVAL_INFO).find((entry) => entry.season === seasonState.season) ?? null;
  const seasonStory = storyMarkers.find((entry) => entry.season === seasonState.season) ?? null;
  const festivalComplete = seasonFestival
    ? hasCompletedFestival(festivalState, seasonFestival.id, seasonState.year)
    : false;
  const preferredCrops = FARM_CROPS
    .filter((crop) => getCropPreferredSeason(crop, seasonState.season))
    .map((crop) => FARM_CROP_INFO[crop].label);

  return (
    <div className="calendar-panel" data-calendar-panel="season-planner">
      <div className="calendar-season-track" aria-label={`Year ${seasonState.year} season progress`}>
        {SEASONS.map((season) => {
          const current = season === seasonState.season;
          const discovered = seasonState.discoveredSeasons.includes(season);
          return (
            <span
              key={season}
              className={`${current ? 'is-current' : ''} ${discovered ? 'is-discovered' : 'is-undiscovered'}`}
              aria-current={current ? 'step' : undefined}
            >
              <img src={SEASON_INFO[season].icon} alt="" aria-hidden="true" />
              <small>{SEASON_INFO[season].shortLabel}</small>
            </span>
          );
        })}
      </div>

      <header className="calendar-hero">
        <img src={SEASON_INFO[seasonState.season].icon} alt="" aria-hidden="true" />
        <div>
          <span>YEAR {seasonState.year} · {SEASON_INFO[seasonState.season].shortLabel}</span>
          <strong>{SEASON_INFO[seasonState.season].label} {seasonState.day}일</strong>
          <small>{WEATHER_INFO[weatherState.weather].label} · 계절 종료까지 {7 - seasonState.day}일</small>
        </div>
        <img src={WEATHER_INFO[weatherState.weather].icon} alt="" aria-hidden="true" />
      </header>

      <div className="calendar-week" aria-label={`${SEASON_INFO[seasonState.season].label} seven day forecast`}>
        {calendarDays.map((day) => (
          <article
            key={day.day}
            className={`${day.day === seasonState.day ? 'is-today' : ''} ${day.day < seasonState.day ? 'is-past' : ''} ${day.festival ? 'is-festival' : ''} ${day.story ? 'has-story' : ''}`}
            data-calendar-day={day.day}
            aria-label={`${day.day}일, ${WEATHER_INFO[day.weather].label}${day.festival ? `, ${day.festival.label}` : ''}`}
          >
            <span>DAY</span>
            <strong>{day.day}</strong>
            <img src={WEATHER_INFO[day.weather].icon} alt="" aria-hidden="true" />
            <small>{WEATHER_INFO[day.weather].label}</small>
            {day.festival && <i title={day.festival.label} />}
            {day.story && <img className="calendar-story-bell" src={STORY_ASSETS.bellKeepsake} title={day.story.label} alt={`${day.story.label} story event`} />}
          </article>
        ))}
      </div>

      <section className="calendar-agenda" aria-label="Season agenda">
        {seasonStory && (
          <div className="calendar-story-agenda">
            <img src={STORY_ASSETS.bellKeepsake} alt="" aria-hidden="true" />
            <p>
              <span>MAIN STORY</span>
              <strong>{seasonStory.label} · {seasonStory.day}일</strong>
            </p>
          </div>
        )}
        <div>
          <CalendarDays aria-hidden="true" />
          <p>
            <span>SEASON EVENT</span>
            <strong>{seasonFestival ? `${seasonFestival.label} · 7일` : '이번 계절에는 축제가 없습니다'}</strong>
          </p>
          {festivalComplete && <CheckCircle2 aria-label="Festival complete" />}
        </div>
        <div>
          <img src={SEASON_INFO[seasonState.season].icon} alt="" aria-hidden="true" />
          <p>
            <span>SEASON CROPS</span>
            <strong>{preferredCrops.join(' · ') || '계절 특화 작물 없음'}</strong>
          </p>
        </div>
      </section>
    </div>
  );
}
