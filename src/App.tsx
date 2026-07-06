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
import { PortfolioDoodle } from './components/PortfolioDoodle';
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
    <main data-app="loop-dog-lab" data-ui-pass="gianluca-clean-portfolio" data-font="pretendard" data-source="060703-resume">
      <nav className="site-nav" aria-label="primary">
        <a href="#top" className="brand-lockup" aria-label="portfolio home">
          <span className="brand-mark">USY</span>
        </a>
        <div className="nav-links">
          <a href="#featured">FEATURED</a>
          <a href="#capabilities">CAPABILITY</a>
          <a href="#experience">WORK</a>
          <a href="#skills">STACK</a>
        </div>
        <div className="nav-pills" aria-label="profile links">
          <a href="https://github.com/SoSyn2ne" target="_blank" rel="noreferrer">GH</a>
          <a href="#workflow">AI</a>
          <a href="#contact" className="nav-cta">Contact</a>
        </div>
      </nav>

      <section className="hero-section" id="top">
        <div className="hero-art-card" aria-label="portfolio illustration">
          <PortfolioDoodle />
          <div className="featured-word" id="featured">Featured</div>
        </div>

        <Card className="intro-card">
          <div className="intro-avatar" aria-hidden="true">USY</div>
          <div className="intro-kicker">{hero.label}</div>
          <h1>엄신용</h1>
          <p className="intro-title">{hero.headline.join(' ')}</p>
          <p className="hero-subcopy">{hero.subcopy}</p>
          <p className="hero-ai-line">{hero.aiLine}</p>
          <div className="hero-actions">
            <Button size="lg" onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}>
              경력 보기 <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' })}>
              AI 활용 <Sparkles size={18} />
            </Button>
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
        <div className="section-heading split-heading">
          <p className="eyebrow"><Layers3 size={15} /> 핵심 역량</p>
          <h2>실제 운영 경험에서 나온 네 가지 개발 축.</h2>
          <p>새 기능을 붙이는 기술보다, 기존 시스템이 어떻게 버티고 있는지 읽는 기술이 먼저였습니다. 네 축은 그 경험을 화면, 운영, 도메인, AI 활용으로 나눈 것입니다.</p>
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

          <Card className="capability-detail" data-active-capability={activeCapability.id}>
            <div className="detail-icon"><ActiveCapabilityIcon size={28} /></div>
            <p className="eyebrow">Selected capability</p>
            <h3>{activeCapability.title}</h3>
            <p>{activeCapability.body}</p>
            <div className="tag-row large-tags">
              {activeCapability.points.map((point) => <span key={point}>{point}</span>)}
            </div>
          </Card>
        </div>
      </section>

      <section className="section experience-section" id="experience">
        <div className="section-heading wide">
          <p className="eyebrow"><BriefcaseBusiness size={15} /> 경력 기반 작업</p>
          <h2>업무는 달랐지만 계속 같은 문제를 다뤘습니다.</h2>
          <p>이 변경은 어디까지 영향을 주는가. 실패하면 누가 먼저 아는가. 다시 고칠 때 어디서 시작할 수 있는가. AWP/BIM, 문자 발송 서버, 앱 API, 쇼핑몰 유지보수는 그 질문을 다른 환경에서 반복한 기록입니다.</p>
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

          <Card className="experience-detail" data-selected-experience={selectedExperience.id}>
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
          <h2>AI는 판단을 대신하지 않습니다. 반복을 줄여 판단할 시간을 만듭니다.</h2>
          <p>AI 도구를 쓰는 이유는 개발자를 덜 책임지게 만들기 위해서가 아닙니다. 낯선 코드의 검색 비용, 구현안 비교, 검증 반복을 줄이고, 변경 범위와 책임을 사람이 더 오래 보게 하기 위해서입니다.</p>
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
          <h2>기술은 이름보다 쓰인 맥락이 중요합니다.</h2>
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

      <footer className="site-footer" id="contact">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h2>운영 중인 시스템을 읽는 힘과, 반복을 줄이는 AI 활용 방식.</h2>
          <p>이 포트폴리오는 기술 키워드보다 변경 범위, 검증, 운영 맥락을 먼저 보여줍니다.</p>
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
