import { CheckCircle2, Flag, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { usePortfolioStore } from '../store/portfolioStore';

export function ModeSwitch() {
  const mode = usePortfolioStore((state) => state.buildMode);
  const setMode = usePortfolioStore((state) => state.setBuildMode);
  const isRalph = mode === 'ralph';

  return (
    <Card className="mode-card" data-mode-card={mode}>
      <div className="section-heading compact">
        <p className="eyebrow">Operator modes</p>
        <h2>/goal vs /ralph</h2>
        <p>
          `/goal`은 목표를 포장해 작업 에이전트에게 넘기는 방식이고, `/ralph`는 “진짜 완료될 때까지” 검증과 재시도를 더 엄격하게 거는 완료 모드입니다.
        </p>
      </div>
      <div className="mode-toggle" role="tablist" aria-label="build mode comparison">
        <Button variant={mode === 'goal' ? 'primary' : 'secondary'} onClick={() => setMode('goal')}>
          <Target size={16} /> /goal
        </Button>
        <Button variant={mode === 'ralph' ? 'primary' : 'secondary'} onClick={() => setMode('ralph')}>
          <Flag size={16} /> /ralph
        </Button>
      </div>
      <div className="mode-detail">
        <div className="mode-badge"><CheckCircle2 size={18} /> {isRalph ? 'true completion mode' : 'goal handoff mode'}</div>
        <h3>{isRalph ? '완료 보고를 늦추고 검증을 강화합니다.' : '목표와 범위를 worker에게 명확히 넘깁니다.'}</h3>
        <ul>
          {isRalph ? (
            <>
              <li>구현 → 테스트/build/lint → 브라우저 확인 → 리뷰까지 끝낸 뒤 보고</li>
              <li>작업이 거절되거나 약하면 다시 시도</li>
              <li>“다 됨”보다 fresh evidence와 완료 기준을 우선</li>
            </>
          ) : (
            <>
              <li>프로젝트 목표, 비목표, 스택, 산출물을 worker에게 전달</li>
              <li>Codex나 다른 코딩 에이전트가 실행하기 좋은 작업 패키지</li>
              <li>검증은 별도 하네스/오케스트레이터가 이어받아 확인</li>
            </>
          )}
        </ul>
      </div>
    </Card>
  );
}
