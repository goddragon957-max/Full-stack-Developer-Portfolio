import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  FileText,
  GitBranch,
  Layers3,
  Sparkles,
} from 'lucide-react';
import { TechEngine3D } from './components/TechEngine3D';
import { AnimatedGrid, BorderBeam, ShimmerText } from './components/magic/effects';
import { Particles } from './components/magic/Particles';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import {
  capabilities,
  experienceCategories,
  experiences,
  hero,
  skillGroups,
  stats,
  workflowSteps,
} from './data/portfolio';
import { usePortfolioStore } from './store/portfolioStore';

export function App() {
  const category = usePortfolioStore((state) => state.category);
  const selectedExperienceId = usePortfolioStore((state) => state.selectedExperienceId);
  const activeCapabilityId = usePortfolioStore((state) => state.activeCapabilityId);
  const setCategory = usePortfolioStore((state) => state.setCategory);
  const setSelectedExperienceId = usePortfolioStore((state) => state.setSelectedExperienceId);
  const setActiveCapabilityId = usePortfolioStore((state) => state.setActiveCapabilityId);

  const filteredExperiences = category === 'All' ? experiences : experiences.filter((item) => item.category === category);
  const selectedExperience = experiences.find((item) => item.id === selectedExperienceId) ?? experiences[0];
  const activeCapability = capabilities.find((item) => item.id === activeCapabilityId) ?? capabilities[0];
  const SelectedIcon = selectedExperience.icon;
  const ActiveCapabilityIcon = activeCapability.icon;

  const handleCategory = (item: (typeof experienceCategories)[number]) => {
    setCategory(item);
    const next = item === 'All' ? experiences[0] : experiences.find((experience) => experience.category === item);
    if (next) setSelectedExperienceId(next.id);
  };

  return (
    <main data-app="loop-dog-lab" data-ui-pass="magic-resume-portfolio" data-source="060703-resume">
      <Particles quantity={118} color="#7dd3fc" />
      <AnimatedGrid />
      <div className="aurora aurora-one" aria-hidden="true" />
      <div className="aurora aurora-two" aria-hidden="true" />

      <nav className="site-nav" aria-label="primary">
        <a href="#top" className="brand-lockup" aria-label="portfolio home">
          <span className="brand-mark">USY</span>
          <span>
            <strong>엄신용</strong>
            <em>Full-stack · AI workflow</em>
          </span>
        </a>
        <div className="nav-links">
          <a href="#capabilities">역량</a>
          <a href="#experience">경력 증거</a>
          <a href="#workflow">AI 활용</a>
          <a href="#skills">스택</a>
        </div>
      </nav>

      <section className="hero-section" id="top">
        <div className="hero-copy">
          <div className="magic-pill"><Sparkles size={16} /><ShimmerText>{hero.label}</ShimmerText></div>
          <h1>
            <span>{hero.headline[0]}</span>
            <span className="gradient-line">{hero.headline[1]}</span>
            <span>{hero.headline[2]}</span>
          </h1>
          <p className="hero-subcopy">{hero.subcopy}</p>
          <p className="hero-ai-line">{hero.aiLine}</p>
          <div className="hero-actions">
            <Button size="lg" onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}>
              경력 기반 프로젝트 보기 <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' })}>
              AI 활용 방식 보기 <Sparkles size={18} />
            </Button>
          </div>
        </div>

        <Card className="hero-stage magic-card">
          <BorderBeam />
          <BorderBeam delay={3.2} reverse className="beam-violet" />
          <div className="stage-header">
            <span>Resume-grounded portfolio</span>
            <strong>AWP / BIM / Full-stack</strong>
          </div>
          <TechEngine3D />
          <div className="stage-terminal" aria-label="portfolio technical stack flow">
            <span><b>frontend</b> Next.js · React · TypeScript · AG Grid</span>
            <span><b>backend</b> Spring Boot · Java · PostgreSQL · MyBatis</span>
            <span><b>viewer</b> xeokit · XKT · Three.js · BIM workflow</span>
          </div>
        </Card>
      </section>

      <section className="stats-strip" aria-label="portfolio summary stats">
        {stats.map((item) => (
          <div className="stat-tile" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="section capabilities-section" id="capabilities">
        <div className="section-heading">
          <p className="eyebrow"><Layers3 size={15} /> 핵심 역량</p>
          <h2>기능을 만드는 사람보다, 운영 중인 흐름을 이해하고 확장하는 개발자.</h2>
          <p>이력서 기반 공개 내용만 사용했습니다. 쓸데없는 제작 과정 문구 대신 실제 경력에서 증명되는 역량만 묶었습니다.</p>
        </div>

        <div className="capability-layout">
          <div className="capability-grid" role="tablist" aria-label="capability groups">
            {capabilities.map((capability) => {
              const Icon = capability.icon;
              return (
                <button
                  className={`capability-card ${capability.id === activeCapabilityId ? 'active' : ''}`}
                  data-capability-id={capability.id}
                  key={capability.id}
                  onClick={() => setActiveCapabilityId(capability.id)}
                  type="button"
                >
                  <Icon size={22} />
                  <span>{capability.kicker}</span>
                  <strong>{capability.title}</strong>
                  <p>{capability.body}</p>
                </button>
              );
            })}
          </div>

          <Card className="capability-detail magic-card" data-active-capability={activeCapability.id}>
            <BorderBeam delay={1.6} />
            <div className="detail-icon"><ActiveCapabilityIcon size={28} /></div>
            <p className="eyebrow">Selected capability</p>
            <h3>{activeCapability.title}</h3>
            <p>{activeCapability.body}</p>
            <div className="glow-list">
              {activeCapability.points.map((point) => <span key={point}>{point}</span>)}
            </div>
          </Card>
        </div>
      </section>

      <section className="section experience-section" id="experience">
        <div className="section-heading wide">
          <p className="eyebrow"><BriefcaseBusiness size={15} /> 경력 기반 프로젝트</p>
          <h2>포트폴리오 카드는 사이드 프로젝트가 아니라, 실제 경력에서 나온 증거로 구성합니다.</h2>
          <p>AWP/BIM, 문자 발송 서버, 앱 API/관리자 페이지, 쇼핑몰·웹뷰 유지보수, AI-assisted workflow만 공개용 주요 카드로 사용합니다.</p>
        </div>

        <div className="filter-row" role="tablist" aria-label="experience categories">
          {experienceCategories.map((item) => (
            <button className={item === category ? 'active' : ''} key={item} onClick={() => handleCategory(item)} type="button">
              {item}
            </button>
          ))}
        </div>

        <div className="experience-layout">
          <div className="experience-list">
            {filteredExperiences.map((experience) => {
              const Icon = experience.icon;
              return (
                <button
                  className={`experience-card ${experience.id === selectedExperienceId ? 'active' : ''}`}
                  data-experience-id={experience.id}
                  key={experience.id}
                  onClick={() => setSelectedExperienceId(experience.id)}
                  type="button"
                >
                  <span className="experience-icon"><Icon size={21} /></span>
                  <span className="experience-meta">{experience.period}</span>
                  <strong>{experience.title}</strong>
                  <p>{experience.summary}</p>
                  <em>{experience.company}</em>
                </button>
              );
            })}
          </div>

          <Card className="experience-detail magic-card" data-selected-experience={selectedExperience.id}>
            <BorderBeam />
            <div className="detail-topline">
              <span className="detail-icon"><SelectedIcon size={28} /></span>
              <div>
                <span>{selectedExperience.company}</span>
                <strong>{selectedExperience.period}</strong>
              </div>
            </div>
            <p className="eyebrow">Career evidence</p>
            <h3>{selectedExperience.title}</h3>
            <p className="role-line">{selectedExperience.role}</p>
            <p>{selectedExperience.summary}</p>
            <div className="highlight-list">
              {selectedExperience.highlights.map((item) => (
                <span key={item}><CheckCircle2 size={15} />{item}</span>
              ))}
            </div>
            <div className="proof-block">
              <span>이 카드가 증명하는 것</span>
              <strong>{selectedExperience.proof}</strong>
            </div>
            <div className="tag-row">
              {selectedExperience.stack.map((item) => <span key={item}>{item}</span>)}
            </div>
          </Card>
        </div>
      </section>

      <section className="section workflow-section" id="workflow">
        <div className="section-heading centered">
          <p className="eyebrow"><Sparkles size={15} /> AI 활용 방식</p>
          <h2>AI를 “답변기”가 아니라 개발 흐름을 빠르게 굴리는 작업 하네스로 씁니다.</h2>
          <p>코드 탐색, 구현 초안, 리팩터링, 문서화, 반복 검증을 분리해서 자동화 가능한 작업 단위로 다룹니다.</p>
        </div>
        <div className="workflow-grid">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card className="workflow-card" key={step.title}>
                <span className="step-index">0{index + 1}</span>
                <Icon size={24} />
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="section skills-section" id="skills">
        <div className="section-heading wide">
          <p className="eyebrow"><FileText size={15} /> 기술 스택</p>
          <h2>키워드 나열 대신 기능별로 묶은 실무 스택.</h2>
        </div>
        <div className="skill-grid">
          {skillGroups.map((group) => {
            const Icon = group.icon;
            return (
              <Card className="skill-card" key={group.title}>
                <Icon size={24} />
                <h3>{group.title}</h3>
                <div>
                  {group.items.map((item) => <span key={item}>{item}</span>)}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h2>풀스택 개발, AWP/BIM, AI-assisted workflow를 한 화면에 정리했습니다.</h2>
          <p>이력서 기반 소개, 핵심 역량, 경력 증거, 기술 스택만 간결하게 보여줍니다.</p>
        </div>
        <div className="footer-actions">
          <a href="https://github.com/SoSyn2ne" target="_blank" rel="noreferrer"><GitBranch size={18} /> GitHub</a>
          <a href="#experience"><BriefcaseBusiness size={18} /> Career evidence</a>
          <a href="#top"><ExternalLink size={18} /> Back to top</a>
        </div>
      </footer>
    </main>
  );
}
