import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  Globe2,
  Mail,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
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
  const validatedCount = projects.filter((project) => project.caseStudy.completionLevel === 'validated').length;
  const verifiedCount = projects.filter((project) => project.caseStudy.completionLevel === 'verified').length;

  const handleCategory = (item: (typeof categories)[number]) => {
    setCategory(item);
    const nextProject = item === 'All' ? projects[0] : projects.find((project) => project.category === item);
    if (nextProject) {
      setSelectedProjectId(nextProject.id);
    }
  };

  return (
    <main data-app="loop-dog-lab" data-ui-pass="marketing-portfolio-rebuild" data-skin="linear">
      <div className="site-noise" aria-hidden="true" />
      <aside className="identity-rail" id="top">
        <a className="brand-lockup" href="#top" aria-label="Loop Dog Lab home">
          <span className="brand-symbol">LD</span>
          <span>
            <strong>Loop Dog Lab</strong>
            <em>AI work loops / portfolio</em>
          </span>
        </a>

        <div className="identity-copy">
          <p className="eyebrow"><Sparkles size={14} /> Marketing UI rebuild · break the default</p>
          <h1>
            <span>AI에게 일을 맡기고,</span>
            <span className="accent-line">끝까지 검증되는 루프를</span>
            <span>만듭니다.</span>
          </h1>
          <p className="hero-subtitle">
            아이디어를 던지는 사람보다, 실행·검증·배포까지 닫히는 작업 시스템을 설계하는 사람으로 보이게 다시 잡았습니다.
            댕댕이와 멍멍이는 장식이 아니라 역할 분리의 작은 브랜드 신호입니다.
          </p>
        </div>

        <div className="hero-actions">
          <Button size="lg" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
            프로젝트 증거 보기 <ArrowRight size={18} />
          </Button>
          <Button size="lg" variant="secondary" onClick={() => document.getElementById('loop')?.scrollIntoView({ behavior: 'smooth' })}>
            루프 구조 보기 <Workflow size={18} />
          </Button>
        </div>

        <div className="identity-metrics" aria-label="portfolio stats">
          <div><strong>{projects.length}</strong><span>mapped projects</span></div>
          <div><strong>{verifiedCount}</strong><span>verified loops</span></div>
          <div><strong>{validatedCount}</strong><span>validated bet</span></div>
        </div>

        <div className="operator-mini-grid" aria-label="DengDeng and MeongMeong operating roles">
          <div className="operator-mini-card">
            <span className="dog-dot">댕</span>
            <strong>댕댕이</strong>
            <p>만들고 밀어붙이는 실행 worker</p>
          </div>
          <div className="operator-mini-card">
            <span className="dog-dot qa">멍</span>
            <strong>멍멍이</strong>
            <p>검증하고 기록하는 orchestration layer</p>
          </div>
        </div>

        <div className="reference-note">
          <span>References</span>
          <p>Rauno card rhythm · Brittany rail structure · Paco restraint · Josh-level playful detail</p>
        </div>
      </aside>

      <div className="content-rail">
        <nav className="top-nav" aria-label="primary">
          <a href="#loop">Loop</a>
          <a href="#harness">Harness</a>
          <a href="#projects">Projects</a>
          <a href="#stack">Stack</a>
        </nav>

        <section className="hero-board" aria-label="portfolio design direction">
          <Card className="manifesto-card">
            <p className="eyebrow">Design reset</p>
            <h2>귀여운 척을 빼고, 작업 시스템이 보이는 포트폴리오로.</h2>
            <p>
              이 화면의 목적은 “AI로 뭔가 합니다”가 아니라, 목표를 정의하고 worker를 투입하고 fresh evidence로 완료를 판정하는 운영 방식을 보여주는 것입니다.
            </p>
            <div className="manifesto-points">
              <span>Marketing UI</span>
              <span>One accent</span>
              <span>Evidence first</span>
              <span>Mascot as signal</span>
            </div>
          </Card>

          <Card className="proof-card featured-proof">
            <span className="proof-index">01</span>
            <strong>Positioning</strong>
            <p>AI Product Builder가 아니라, 반복 가능한 AI 작업 루프를 설계하는 operator.</p>
          </Card>
          <Card className="proof-card">
            <span className="proof-index">02</span>
            <strong>Visual language</strong>
            <p>거대한 캐릭터 대신 editorial rail, compact cards, warm grayscale, signal green.</p>
          </Card>
          <Card className="proof-card">
            <span className="proof-index">03</span>
            <strong>Portfolio promise</strong>
            <p>각 프로젝트는 Problem → Loop → Harness / Evidence → Next Step으로 읽힙니다.</p>
          </Card>
        </section>

        <section className="section" id="loop">
          <div className="section-kicker-row">
            <p className="eyebrow"><GitBranch size={14} /> Loop Engineering</p>
            <span>Prompt가 아니라 운영 단위</span>
          </div>
          <div className="section-heading">
            <h2>한 번 만드는 화면보다, 다시 실행되는 작업 루프가 더 중요합니다.</h2>
            <p>
              목표, 작업, 검증, 보고가 따로 놀지 않게 묶습니다. 그래서 “완료”는 말이 아니라 빌드 로그, 브라우저 smoke, 배포 확인 같은 증거로 남습니다.
            </p>
          </div>
          <div className="loop-ladder">
            {loopSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card className="loop-step" key={step.title}>
                  <span className="step-index">0{index + 1}</span>
                  <Icon size={19} />
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="section harness-section" id="harness">
          <ModeSwitch />
          <Card className="evidence-panel" aria-label="Ralph completion evidence levels">
            <p className="eyebrow"><ShieldCheck size={14} /> Ralph Evidence</p>
            <h2>진짜 완료는 세 단계로만 말합니다.</h2>
            <div className="completion-levels">
              {completionLevels.map((item) => (
                <div className={`completion-level ${item.level}`} key={item.level}>
                  <strong>{item.label}</strong>
                  <span>{item.body}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="section projects-section" id="projects">
          <div className="section-kicker-row">
            <p className="eyebrow"><CheckCircle2 size={14} /> Side Projects</p>
            <span>카드는 장식이 아니라 작업 증거</span>
          </div>
          <div className="section-heading project-heading">
            <h2>작업물은 예쁜 썸네일보다, 무엇을 자동화했고 어떻게 검증했는지가 먼저입니다.</h2>
            <p>
              필터와 프로젝트 선택은 실제 상태로 연결되어 있습니다. 선택한 프로젝트의 문제, 루프, 검증 근거, 다음 단계가 함께 바뀝니다.
            </p>
          </div>

          <div className="filter-row" role="tablist" aria-label="project categories">
            {categories.map((item) => (
              <button className={item === category ? 'active' : ''} key={item} onClick={() => handleCategory(item)} type="button">
                {item}
              </button>
            ))}
          </div>

          <div className="selected-project-summary" aria-live="polite">
            <span>Now studying</span>
            <strong>{selectedProject.title}</strong>
            <em>{selectedProject.caseStudy.completionLevel}</em>
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
              <div className="detail-topline">
                <div className="detail-icon"><SelectedIcon size={24} /></div>
                <span className={`status-pill ${selectedProject.status}`}>{selectedProject.status}</span>
              </div>
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
            <p className="eyebrow"><Globe2 size={14} /> Stack</p>
            <h2>제품 제작, 에이전트 운영, 인프라, 검증을 한 문법으로 묶습니다.</h2>
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
            <h2>댕댕이는 실행하고, 멍멍이는 완료 기준을 닫습니다.</h2>
          </div>
          <div className="footer-actions">
            <a href="https://github.com/SoSyn2ne" target="_blank" rel="noreferrer"><GitBranch size={18} /> GitHub</a>
            <a href="mailto:hello@loopdog.local"><Mail size={18} /> Contact</a>
            <a href="#top"><ExternalLink size={18} /> Back to top</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
