# Portfolio Content Map — Source-Grounded

## Source

- `060703.pdf` 이력서 추출본
- Purpose: 개인 포트폴리오 사이트의 **소개/경력/역량 근거**를 이 문서 기준으로 재기획한다.

## Critical Content Rule

이 포트폴리오는 빈 공간을 채우려고 임의의 마케팅 문구를 만들지 않는다.

- 이력서/PDF에 있는 내용이 우선이다.
- 공개용 소개글에는 직무 정체성, 핵심 경력, 기술 역량, AI 활용 방식만 사용한다.
- 쓸 말이 부족하면 장식 문장을 만들지 말고 기능/섹션만 정의한다.
- 개인 연락처, 주소, 연봉, 군 복무 등 민감하거나 사이트에 불필요한 정보는 기본적으로 제외한다.

## Public Positioning

### Core identity

**이미 돌아가는 시스템을 읽고, 필요한 만큼 바꾸는 풀스택 개발자.**

PHP/CodeIgniter 유지보수에서 시작해 Java/Spring Boot, Next.js/React, TypeScript 기반 화면·API·DB·서버·배포 흐름을 함께 다뤄왔다. 핵심은 새 화면을 예쁘게 만드는 문장이 아니라 운영 중인 시스템에서 어디까지 안전하게 바꿀 수 있는지 읽어내는 능력이다.

### Differentiator

**AI-assisted coding을 판단 대체가 아니라 반복 제거에 쓰는 개발자.**

GPT, Cursor, Codex, OpenCode, AGENTS.md, Skills, MCP, role prompt, subagent/workflow 구성을 코드 탐색, 구현안 비교, 리팩터링 후보 정리, 문서화, 반복 검증에 활용한다. AI는 판단을 대신하지 않고 검색, 초안, 검증 반복을 줄여 최종 판단에 시간을 남기는 장치로 설명한다.

### Strongest current work

**AWP 업무 시스템 및 3D/BIM 뷰어 개발/검증**

- 건설/플랜트 업무 데이터 웹 시스템
- Workpackage, IWP, BIM 관리/할당, 도면, 문서, MTO, 리비전 이력
- Next.js/React/TypeScript 화면
- MUI/AG Grid 기반 목록/입력 UI
- Spring Boot REST API, PostgreSQL/MyBatis, JWT
- xeokit SDK/XKT, tile/LOD, selection/hide/xray/clipping/camera fit 검증
- pgvector 기반 검색 흐름 및 AI/Copilot 연동 검토/구현

## Site Sections

### 1. Hero / Introduction

Goal: 이 사람을 “AI product builder” 같은 추상 문구가 아니라, 실제 운영/구현 경험을 가진 풀스택 개발자로 소개한다.

Must include:

- 이미 운영 중인 시스템을 읽고 변경하는 풀스택 개발자
- 운영/유지보수 기반 성장
- 화면/API/DB/서버/배포 흐름
- AI-assisted coding / agent workflow 활용
- 운영 안정성, 변경 범위, 검증 관점

Do not include:

- 과장된 AI 창업가 문구
- 어린왕자식 감성 문구, 따뜻함/살펴봄/함께함 같은 범용 표현
- 댕댕이/멍멍이 중심 소개
- 검증되지 않은 사이드 프로젝트 나열

### 2. Capabilities

Use 4 capability blocks only:

1. **Full-stack Web Development**
   - Next.js, React, TypeScript, Vue.js
   - Java/Spring Boot, REST API
   - PHP/CodeIgniter legacy maintenance

2. **Service Operation & Maintenance**
   - 운영 중인 서비스 오류 수정
   - 기능 추가와 리팩터링
   - DB/서버/배포 흐름 이해

3. **AWP / BIM / 3D Viewer Work**
   - 건설/플랜트 업무 시스템
   - BIM/도면/문서/MTO/Workpackage
   - xeokit/XKT/Three.js viewer 검증

4. **AI-assisted Development Workflow**
   - GPT/Cursor/Codex/OpenCode
   - AGENTS.md, Skills, MCP
   - 코드 탐색, 구현안 비교, 문서화, 검증 반복 축소

### 3. Experience Evidence

Use real career/project cards from the PDF, not invented portfolio projects.

Recommended cards:

1. **AWP 업무 시스템 및 3D/BIM 뷰어**
   - Current flagship experience
   - Best proof of modern frontend/backend/domain complexity

2. **문자 발송 서버 및 웹 서비스 운영**
   - Java, REST API, AWS, Vue.js, CI/CD

3. **앱 API 및 관리자 페이지 운영**
   - 앱/웹 연동, DB/서버 운영, 장애 대응

4. **쇼핑몰/홈페이지/웹뷰 앱 유지보수**
   - PHP/CodeIgniter, Linux, MySQL/PostgreSQL, PG API

### 4. Skills

Group skills by function instead of dumping all keywords.

- Frontend: Next.js, React, TypeScript, Vue.js, JavaScript, HTML/CSS, MUI, AG Grid
- Backend: Java, Spring Boot, Spring Framework, JSP, PHP, CodeIgniter, REST API
- Database/Infra: PostgreSQL, MySQL, MariaDB, MyBatis, Linux, AWS EC2/S3/CloudFront/RDS, Apache/Nginx
- 3D/BIM: xeokit, XKT, Three.js, BIM viewer validation
- AI Workflow: GPT, Cursor, Codex, OpenCode, AGENTS.md, Skills, MCP, subagent/workflow

### 5. Optional Personal/AI Projects

Personal/OpenClaw/Hermes/Loop Dog Lab content should only appear after the resume-grounded professional introduction is clear.

Default treatment:

- Keep as a small “AI workflow experiments” section.
- Do not make it the core portfolio identity unless the user explicitly wants an AI-agent portfolio rather than a professional developer portfolio.

## Remove From Current Site Direction

Remove or demote:

- Fake/overbroad “AI Product Builder” positioning as primary identity.
- Excessive “Loop Dog Lab” self-branding before explaining the person.
- Random project atlas of unrelated side projects above career evidence.
- Mascot-heavy character sections.
- Long explanatory filler like “귀여운 척을 빼고…” in the public site. That can stay in planning docs, not in user-facing copy.

## Next Content Work

1. Approve hero copy from `docs/copy/hero.md`.
2. Replace public project cards with real experience evidence cards.
3. Move personal AI workflow experiments below professional experience.
4. Keep only sections that introduce the person, skills, career evidence, and AI-assisted workflow.
