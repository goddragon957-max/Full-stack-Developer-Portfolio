import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { cn } from '../lib/utils';

type Props = {
  project: Project;
  selected: boolean;
  onSelect: () => void;
};

const statusLabel: Record<Project['status'], string> = {
  active: 'Active',
  lab: 'Lab',
  infra: 'Infra',
  prototype: 'Prototype',
};

export function ProjectCard({ project, selected, onSelect }: Props) {
  const Icon = project.icon;
  return (
    <button
      className={cn('project-card group text-left', selected && 'selected')}
      onClick={onSelect}
      type="button"
      data-project-id={project.id}
    >
      <div className="project-card-top">
        <span className="project-icon"><Icon size={18} /></span>
        <span className={`status-pill ${project.status}`}>{statusLabel[project.status]}</span>
      </div>
      <span className="project-kicker">{project.kicker}</span>
      <h3>{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <div className="project-proof-line">
        <span>Evidence</span>
        <strong>{project.caseStudy.completionLevel}</strong>
      </div>
      <div className="project-impact">
        <strong>{project.impact}</strong>
        <ArrowUpRight size={16} />
      </div>
    </button>
  );
}
