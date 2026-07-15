import { Check, LockKeyhole, MapPin } from 'lucide-react';
import {
  STORY_ASSETS,
  STORY_CHAPTER_INFO,
  STORY_SEAL_IDS,
  getStoryChapterView,
  getStoryDestination,
  type StorySealId,
  type StoryState,
} from '../../game/storySystem';

const sealLabels: Record<StorySealId, string> = {
  sprout: '새싹',
  tide: '물결',
  harvest: '수확',
  starlight: '별빛',
};

type MainStoryPanelProps = {
  storyState: StoryState;
};

export function MainStoryPanel({ storyState }: MainStoryPanelProps) {
  const chapter = getStoryChapterView(storyState);
  const destination = getStoryDestination(storyState);

  return (
    <section className="main-story-panel" aria-labelledby="main-story-title" data-main-story={chapter.chapterId}>
      <header>
        <img src={STORY_ASSETS.oldBell} alt="" aria-hidden="true" />
        <div>
          <span>MAIN STORY · {chapter.eyebrow}</span>
          <h3 id="main-story-title">{chapter.title}</h3>
          <small>{chapter.status === 'available' ? '주민과 대화해 시작하세요' : chapter.status === 'complete' ? 'CHAPTER COMPLETE' : 'IN PROGRESS'}</small>
        </div>
        <b>{STORY_SEAL_IDS.filter((seal) => storyState.seals.includes(seal)).length}/4</b>
      </header>

      <div className="story-seal-track" aria-label="Season seals">
        {STORY_SEAL_IDS.map((seal) => {
          const acquired = storyState.seals.includes(seal);
          return (
            <span key={seal} className={acquired ? 'is-acquired' : 'is-locked'} title={`${sealLabels[seal]}의 인장`}>
              <img src={STORY_ASSETS.seals[seal]} alt="" aria-hidden="true" />
              <small>{sealLabels[seal]}</small>
              {!acquired && <LockKeyhole aria-hidden="true" />}
            </span>
          );
        })}
      </div>

      <ol className="story-objective-list">
        {chapter.objectives.map((item) => (
          <li key={item.id} className={item.complete ? 'is-complete' : ''}>
            <i>{item.complete ? <Check aria-hidden="true" /> : <span />}</i>
            <p><strong>{item.label}</strong><small>{item.current}/{item.target}</small></p>
          </li>
        ))}
      </ol>

      <footer data-story-destination={destination.region}>
        <MapPin aria-hidden="true" />
        <p><span>NEXT DESTINATION</span><strong>{destination.label}</strong></p>
        <small>{STORY_CHAPTER_INFO[chapter.chapterId].season?.toUpperCase() ?? 'MOSSBELL'}</small>
      </footer>
    </section>
  );
}
