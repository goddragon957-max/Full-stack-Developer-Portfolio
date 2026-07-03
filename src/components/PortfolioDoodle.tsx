export function PortfolioDoodle() {
  return (
    <svg className="portfolio-doodle" viewBox="0 0 760 560" role="img" aria-label="운영 웹, API, BIM 뷰어를 다루는 개발자 일러스트">
      <defs>
        <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.25" fill="currentColor" opacity="0.32" />
        </pattern>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#6a4540" floodOpacity="0.12" />
        </filter>
      </defs>

      <g className="doodle-stroke" filter="url(#softShadow)">
        <rect x="118" y="108" width="424" height="284" rx="54" className="doodle-fill" />
        <rect x="168" y="162" width="260" height="154" rx="26" className="doodle-panel" />
        <path d="M190 283 L265 216 L318 260 L358 226 L408 283 Z" className="doodle-hatch" />
        <circle cx="210" cy="194" r="20" className="doodle-cream" />
        <rect x="370" y="82" width="172" height="124" rx="28" className="doodle-hatch" />
        <path d="M402 122 H506 M402 154 H510" />
        <path d="M95 124 L187 154 L156 207 L70 176 Z" className="doodle-tool" />
        <path d="M86 137 L112 147 M145 155 L170 165" />
        <circle cx="86" cy="172" r="15" className="doodle-cream" />
        <path d="M514 362 L613 326 L598 398 Z" className="doodle-cursor" />
        <path d="M548 374 L580 442" />
        <rect x="544" y="248" width="28" height="28" rx="9" className="doodle-hatch" />
      </g>

      <g className="developer-figure doodle-stroke">
        <circle cx="122" cy="327" r="40" className="doodle-cream" />
        <path d="M95 314 C70 296 75 254 113 258 C137 260 146 283 139 306" className="doodle-hair" />
        <path d="M105 325 C114 337 128 338 139 326" />
        <path d="M73 382 C91 354 132 352 153 378 L170 472 L84 472 Z" className="doodle-person" />
        <rect x="32" y="392" width="52" height="86" rx="14" className="doodle-panel" />
        <path d="M54 407 V462" />
        <path d="M155 392 C196 382 222 394 232 423" />
        <path d="M159 420 H318" />
        <rect x="204" y="332" width="186" height="124" rx="18" className="doodle-laptop" />
        <path d="M222 372 H306 M222 398 H342 M222 424 H288" />
        <path d="M122 472 V528 M164 472 V528 M83 528 H135 M146 528 H202" />
        <path d="M42 489 H205" />
      </g>

      <g className="profile-card doodle-stroke">
        <rect x="494" y="88" width="238" height="194" rx="32" className="doodle-lavender" />
        <circle cx="613" cy="148" r="50" className="doodle-avatar" />
        <path d="M579 151 C588 117 638 112 652 151" className="doodle-hair" />
        <circle cx="596" cy="151" r="13" className="doodle-cream" />
        <circle cx="629" cy="151" r="13" className="doodle-cream" />
        <path d="M606 179 C615 186 625 185 634 178" />
        <path d="M558 229 H688" />
        <path d="M568 248 H676" />
      </g>

      <g className="floating-tags">
        <text x="420" y="472">Spring Boot</text>
        <text x="558" y="472">React</text>
        <text x="432" y="510">BIM Viewer</text>
        <text x="585" y="510">AI Workflow</text>
      </g>
    </svg>
  );
}
