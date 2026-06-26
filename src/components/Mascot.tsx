type MascotProps = {
  name: 'deng' | 'meong';
  label: string;
  role: string;
};

export function Mascot({ name, label, role }: MascotProps) {
  const isDeng = name === 'deng';
  return (
    <div className={`mascot-card ${isDeng ? 'mascot-deng' : 'mascot-meong'}`}>
      <div className="mascot-figure" aria-hidden="true">
        <div className="ear left" />
        <div className="ear right" />
        <div className="head">
          <div className="goggle" />
          <div className="eye left" />
          <div className="eye right" />
          <div className="snout">
            <span />
          </div>
        </div>
        <div className="body">
          <div className="badge">{isDeng ? 'GO' : 'QA'}</div>
        </div>
        <div className="paw left" />
        <div className="paw right" />
        <div className="tail" />
      </div>
      <div>
        <p className="eyebrow">{label}</p>
        <h3>{isDeng ? '댕댕이' : '멍멍이'}</h3>
        <p>{role}</p>
      </div>
    </div>
  );
}
