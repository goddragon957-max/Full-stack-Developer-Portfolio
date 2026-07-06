import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  FileText,
  GitBranch,
  Layers3,
} from 'lucide-react';
import { TechScene3D } from './components/TechScene3D';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import {
  capabilities,
  experienceCategories,
  experiences,
  hero,
  skillGroups,
  stats,
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
    <main data-app="loop-dog-lab" data-ui-pass="spline-dark-stack-portfolio" data-font="pretendard" data-source="060703-resume">
      <nav className="site-nav" aria-label="primary">
        <a href="#top" className="brand-lockup" aria-label="portfolio home">
          <span className="brand-mark">USY</span>
        </a>
        <div className="nav-links">
          <a href="#stack">STACK</a>
          <a href="#experience">WORK</a>
          <a href="#capabilities">CAPABILITY</a>
          <a href="#contact">CONTACT</a>
        </div>
        <div className="nav-pills" aria-label="profile links">
          <a href="https://github.com/SoSyn2ne" target="_blank" rel="noreferrer">GH</a>
          <a href="#contact" className="nav-cta">Contact</a>
        </div>
      </nav>

      <section className="hero-section" id="top">
        <Card className="intro-card">
          <div className="intro-kicker">{hero.label}</div>
          <h1>엄신용</h1>
          <p className="intro-title">{hero.headline}</p>
          <p className="hero-subcopy">{hero.subcopy}</p>
          <p className="hero-note">{hero.note}</p>
          <div className="hero-actions">
            <Button size="lg" onClick={() => document.getElementById('stack')?.scrollIntoView({ behavior: 'smooth' })}>
              주요 스택 <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}>
              경력 보기 <BriefcaseBusiness size={18} />
            </Button>
          </div>
        </Card>

        <TechScene3D />
      </section>

      <section className="stats-strip" aria-label="portfolio summary stats">
        {stats.map((item) => (
          <div className="stat-tile" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="section stack-section" id="stack">
        <div className="section-heading wide">
          <p className="eyebrow"><FileText size={15} /> 주요 스택</p>
          <h2>주요 스택.</h2>
          <p>프론트엔드, 백엔드, DB/인프라, 3D/BIM 순서로 정리했습니다.</p>
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

      <section className="section experience-section" id="experience">
        <div className="section-heading wide">
          <p className="eyebrow"><BriefcaseBusiness size={15} /> 경력</p>
          <h2>경력.</h2>
          <p>AWP/BIM 시스템, 문자 발송 서버, 앱 API, 쇼핑몰 유지보수.</p>
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
              <span>확인할 점</span>
              <strong>{selectedExperience.proof}</strong>
            </div>
            <div className="tag-row">
              {selectedExperience.stack.map((item) => <span key={item}>{item}</span>)}
            </div>
          </Card>
        </div>
      </section>

      <section className="section capabilities-section" id="capabilities">
        <div className="section-heading split-heading">
          <p className="eyebrow"><Layers3 size={15} /> 업무 범위</p>
          <h2>풀스택, 운영, AWP/BIM.</h2>
          <p>화면/API 개발, 운영·유지보수, 현재 AWP/BIM 도메인 업무.</p>
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

      <footer className="site-footer" id="contact">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h2>Java/Spring Boot · React/TypeScript · AWP/BIM.</h2>
          <p>PostgreSQL, MyBatis, Linux/AWS 운영 경험을 함께 다뤘습니다.</p>
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
