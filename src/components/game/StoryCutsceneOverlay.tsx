import { X } from 'lucide-react';
import { NPC_WALK_SPRITES } from '../../game/animationCatalog';
import { STORY_CUTSCENES, type StoryCutsceneId } from '../../game/storySystem';

type StoryCutsceneOverlayProps = {
  cutscene: StoryCutsceneId;
  onSkip: () => void;
};

const finaleCast = ['lumi', 'hana', 'jun', 'sera', 'doyun'] as const;

export function StoryCutsceneOverlay({ cutscene, onSkip }: StoryCutsceneOverlayProps) {
  const scene = STORY_CUTSCENES[cutscene];
  return (
    <section
      className={`story-cutscene story-cutscene-${cutscene}`}
      role="dialog"
      aria-modal="true"
      aria-label={scene.title}
      data-story-cutscene={cutscene}
    >
      <button type="button" onClick={onSkip} aria-label="Skip story scene" title="Skip">
        <X aria-hidden="true" />
      </button>
      <div className="story-cutscene-stage" aria-hidden="true">
        <i className="story-season-light light-spring" />
        <i className="story-season-light light-summer" />
        <i className="story-season-light light-autumn" />
        <i className="story-season-light light-winter" />
        <img className="story-cutscene-art" src={scene.asset} alt="" />
        {cutscene === 'finale' && (
          <div className="story-finale-cast">
            {finaleCast.map((npc) => <img key={npc} src={NPC_WALK_SPRITES[npc].up[0]} alt="" />)}
          </div>
        )}
      </div>
      <div className="story-cutscene-copy">
        <span>{scene.eyebrow}</span>
        <strong>{scene.title}</strong>
        {scene.lines.map((line) => <p key={line}>{line}</p>)}
        <em>ESC / TAP × TO SKIP</em>
      </div>
    </section>
  );
}
