import { Box, Code2, Database, ServerCog, Sparkles } from 'lucide-react';

export function TechEngine3D() {
  return (
    <div className="tech-engine" aria-label="3D full-stack and AI workflow engine">
      <div className="engine-glow" aria-hidden="true" />
      <div className="engine-ring ring-one" aria-hidden="true" />
      <div className="engine-ring ring-two" aria-hidden="true" />
      <div className="engine-ring ring-three" aria-hidden="true" />

      <div className="engine-cube" aria-hidden="true">
        <span className="cube-face face-front"><Code2 size={34} />React</span>
        <span className="cube-face face-back"><ServerCog size={34} />Spring</span>
        <span className="cube-face face-right"><Database size={34} />DB</span>
        <span className="cube-face face-left"><Box size={34} />BIM</span>
        <span className="cube-face face-top"><Sparkles size={34} />AI</span>
        <span className="cube-face face-bottom">OPS</span>
      </div>

      <div className="orbit-chip chip-react">Next.js / React</div>
      <div className="orbit-chip chip-spring">Spring Boot</div>
      <div className="orbit-chip chip-bim">xeokit · XKT</div>
      <div className="orbit-chip chip-ai">Codex · MCP</div>
    </div>
  );
}
