import {
  ArrowDown,
  ArrowRight,
  Bot,
  CheckCircle2,
  GitBranch,
  Globe2,
  Mail,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { Mascot } from './components/Mascot';
import { ModeSwitch } from './components/ModeSwitch';
import { ProjectCard } from './components/ProjectCard';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { categories, completionLevels, loopSteps, projects, stackGroups } from './data/portfolio';
import { usePortfolioStore } from './store/portfolioStore';

export function App() {
  const category = usePortfolioStore((state) => state.category);
  const selectedProjectId = usePortfolioStore((state) => state.selectedProjectId);
  const setCategory = usePortfolioStore((state) => state.setCategory);
  const setSelectedProjectId = usePortfolioStore((state) => state.setSelectedProjectId);

  const filteredProjects = category === 'All' ? projects : projects.filter((project) => project.category === category);
  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? projects[0];
  const SelectedIcon = selectedProject.icon;

  return (
    <main data-app="loop-dog-lab">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <nav className="site-nav" aria-label="primary">
        <a className="brand" href="#top" aria-label="Loop Dog Lab home">
          <span className="brand-mark">LD</span>
          <span>Loop Dog Lab</span>
        </a>
        <div className="nav-links">
          <a href="#loop">Loop</a>
          <a href="#harness">Harness</a>
          <a href="#characters">Characters</a>
          <a href="#projects">Projects</a>
          <a href="#stack">Stack</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={14} /> AI Product Builder · Loop & Harness Engineering</p>
          <h1>
            <span className="hero-line">AI가 답만 하는 시대를 넘어,</span>
            <span className="hero-line hero-highlight">일을 맡고 검증하는</span>
            <span className="hero-line">루프를 설계합니다.</span>
          </h1>
          <p className="hero-subtitle">
            OpenClaw의 댕댕이와 Hermes의 멍멍이를 중심으로 아이디어 → 프로토타입 → 자동화 → 검증 → 배포까지 이어지는 사이드 프로젝트 실험실입니다.
          </p>
          <div className="hero-actions">
            <Button size="lg" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
              프로젝트 보기 <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => document.getElementById('loop')?.scrollIntoView({ behavior: 'smooth' })}>
              Loop Engineering <ArrowDown size={18} />
            </Button>
          </div>
          <div className="hero-stats" aria-label="portfolio stats">
            <div><strong>{projects.length}</strong><span>projects mapped</span></div>
            <div><strong>6</strong><span>verification gates</span></div>
            <div><strong>2</strong><span>puppy agents</span></div>
          </div>
        </div>
        <Card className="hero-console">
          <div className="console-top"><span /><span /><span /></div>
          <div className="lab-scene" aria-label="DengDeng and MeongMeong lab illustration">
            <Mascot name="deng" label="execution agent" role="아이디어를 물고 와서 구현 루프를 시작합니다." />
            <Mascot name="meong" label="orchestrator" role="검증, 기록, 배포 확인으로 루프를 닫습니다." />
            <div className="orbit orbit-a">MOM Voice</div>
            <div className="orbit orbit-b">Search Router</div>
            <div className="orbit orbit-c">Dragon Trader</div>
          </div>
          <div className="terminal-lines">
            <span><b>goal</b> portfolio-web v0.1</span>
            <span><b>build</b> Vite · React · TypeScript</span>
            <span><b>verify</b> lint → build → browser smoke</span>
            <span><b>ship</b> Vercel-ready artifact</span>
          </div>
        </Card>
      </section>

      <section className="section about-section">
        <Card className="about-card large">
          <p className="eyebrow">About</p>
          <h2>저는 AI를 “대답하는 도구”가 아니라 “반복 실행하는 작업 시스템”으로 다룹니다.</h2>
          <p>
            이 포트폴리오는 단순한 작업물 전시가 아니라, AI 에이전트와 함께 사이드 프로젝트를 계속 만들고 검증해온 기록입니다. 목표를 정의하고, 작업 에이전트를 투입하고, 빌드와 테스트를 돌리고, 실패하면 다시 수정하는 반복 루프를 중요하게 봅니다.
          </p>
        </Card>
        <div className="capability-grid">
          <Card><Bot /><h3>AI Product Prototyping</h3><p>아이디어를 웹앱, 대시보드, 모바일 앱, 게임 프로토타입으로 빠르게 바꿉니다.</p></Card>
          <Card><Workflow /><h3>Loop Engineering</h3><p>목표·상태·검증·반복 실행을 가진 AI 작업 루프를 설계합니다.</p></Card>
          <Card><CheckCircle2 /><h3>Harness Engineering</h3><p>AI 결과물을 믿기 위해 테스트, 브라우저 smoke, 배포 확인을 하네스로 묶습니다.</p></Card>
        </div>
      </section>

      <section className="section split" id="loop">
        <div className="section-heading">
          <p className="eyebrow">Loop Engineering</p>
          <h2>한 번의 프롬프트가 아니라, 다시 실행 가능한 작업 루프.</h2>
          <p>일반적인 AI 사용은 매번 사람이 프롬프트를 쓰고 복붙하는 방식에 머뭅니다. Loop Engineering은 이 과정을 목표, 실행, 검증, 기록, 다음 루프로 연결합니다.</p>
        </div>
        <div className="loop-grid">
          {loopSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card className="loop-step" key={step.title}>
                <span className="step-index">0{index + 1}</span>
                <Icon size={22} />
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="section split reverse" id="harness">
        <ModeSwitch />
        <div className="section-heading">
          <p className="eyebrow">Harness Engineering</p>
          <h2>“AI가 만들었다”에서 멈추지 않고, 실제로 믿을 수 있게 확인합니다.</h2>
          <p>
            AGENT.md, CODEX_GOAL.md, VERIFY.md, RUNBOOK.md, npm build, 브라우저 smoke, Vercel live check를 묶어 작업이 반복될수록 덜 흔들리게 만듭니다.
          </p>
          <div className="harness-list">
            {['AGENT.md', 'CODEX_GOAL.md', 'VERIFY.md', 'RUNBOOK.md', 'Browser smoke', 'Vercel check'].map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <section className="section" id="characters">
        <div className="section-heading centered">
          <p className="eyebrow">Characters</p>
          <h2>댕댕이가 만들고, 멍멍이가 굴러가게 만듭니다.</h2>
          <p>두 캐릭터는 귀여운 마스코트이면서 동시에 AI 작업 시스템의 역할 분리를 보여줍니다.</p>
        </div>
        <div className="character-grid">
          <Mascot name="deng" label="DengDeng · OpenClaw" role="실행 담당. 아이디어를 프로젝트로 만들고, Codex 목표를 넘기고, 프로토타입을 밀어붙입니다." />
          <Mascot name="meong" label="MeongMeong · Hermes" role="운영 담당. 세션 맥락을 기억하고, 도구를 실행하고, 검증과 기록으로 다음 루프를 엽니다." />
        </div>
      </section>

      <section className="section projects-section" id="projects">
        <div className="section-heading centered">
          <p className="eyebrow">Side Projects</p>
          <h2>아이디어 노트가 아니라, 실제 코드와 검증 흐름을 가진 프로젝트들.</h2>
          <p>프로젝트 카드를 누르면 문제, 작업 루프, 검증 근거, 다음 단계까지 한 번에 바뀝니다.</p>
        </div>
        <Card className="completion-strip" aria-label="Ralph completion evidence levels">
          <div className="completion-strip-copy">
            <p className="eyebrow"><ShieldCheck size={14} /> Ralph Evidence</p>
            <h3>완료는 세 단계로 기록합니다.</h3>
          </div>
          <div className="completion-levels">
            {completionLevels.map((item) => (
              <div className={`completion-level ${item.level}`} key={item.level}>
                <strong>{item.label}</strong>
                <span>{item.body}</span>
              </div>
            ))}
          </div>
        </Card>
        <div className="selected-project-summary" aria-live="polite">
          <span>Now studying</span>
          <strong>{selectedProject.title}</strong>
          <em>{selectedProject.caseStudy.completionLevel}</em>
        </div>
        <div className="filter-row" role="tablist" aria-label="project categories">
          {categories.map((item) => (
            <button className={item === category ? 'active' : ''} key={item} onClick={() => setCategory(item)} type="button">
              {item}
            </button>
          ))}
        </div>
        <div className="projects-layout">
          <div className="project-grid">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                selected={project.id === selectedProjectId}
                onSelect={() => setSelectedProjectId(project.id)}
              />
            ))}
          </div>
          <Card className="project-detail" data-selected-project={selectedProject.id}>
            <div className="detail-icon"><SelectedIcon size={28} /></div>
            <p className="eyebrow">Selected Project</p>
            <h3>{selectedProject.title}</h3>
            <p>{selectedProject.description}</p>
            <div className="detail-block"><span>Impact</span><strong>{selectedProject.impact}</strong></div>
            <div className="detail-block"><span>Stack</span><strong>{selectedProject.stack}</strong></div>
            <div className="case-study-grid" aria-label={`${selectedProject.title} case study evidence`}>
              <div className="case-study-block"><span>Problem</span><p>{selectedProject.caseStudy.problem}</p></div>
              <div className="case-study-block"><span>Loop</span><p>{selectedProject.caseStudy.loop}</p></div>
              <div className="case-study-block"><span>Harness / Evidence</span><p>{selectedProject.caseStudy.evidence}</p></div>
              <div className="case-study-block"><span>Next Step</span><p>{selectedProject.caseStudy.nextStep}</p></div>
              <div className="case-study-block workspace"><span>Repo / Workspace Note</span><p>{selectedProject.caseStudy.workspaceNote}</p></div>
            </div>
            <div className="tag-row large">
              {selectedProject.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </Card>
        </div>
      </section>

      <section className="section stack-section" id="stack">
        <div className="section-heading centered">
          <p className="eyebrow">Stack</p>
          <h2>제품 제작, 에이전트 운영, 인프라, 검증까지 한 흐름으로.</h2>
        </div>
        <div className="stack-grid">
          {stackGroups.map((group) => (
            <Card className="stack-card" key={group.title}>
              <h3>{group.title}</h3>
              <div>
                {group.items.map((item) => <span key={item}>{item}</span>)}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <p className="eyebrow">Loop Dog Lab</p>
          <h2>댕댕이는 실행하고, 멍멍이는 루프로 만듭니다.</h2>
        </div>
        <div className="footer-actions">
          <a href="https://github.com/SoSyn2ne" target="_blank" rel="noreferrer"><GitBranch size={18} /> GitHub</a>
          <a href="mailto:hello@loopdog.local"><Mail size={18} /> Contact</a>
          <a href="#top"><Globe2 size={18} /> Back to top</a>
        </div>
      </footer>
    </main>
  );
}
