# Mossbell World Composition v1

## Objective

네 야외 지역을 독립된 이미지 묶음이 아니라 하나의 평면 월드로 읽히게 만든다. 맵 크기(`32x22`)와 런타임 해상도(`512x352`)는 유지하고, 출구 방향, 도로 폭, 물길, 구역 배치, 충돌 좌표를 하나의 공통 설계로 맞춘다.

## Root Cause

현재 연결은 다음 순서로 한 바퀴를 돈다.

`Farm east -> Forest north -> Coast east -> Mine south -> Farm`

이 관계는 평면 좌표에서 닫히지 않는다. 세 연결을 따라가면 Mine은 Farm의 북동쪽 두 칸에 놓이지만, 마지막 연결은 Mine 바로 아래가 Farm이라고 가정한다. 각 맵의 길은 개별적으로 자연스러워도 월드 전체가 하나로 이어져 보일 수 없는 구조다.

## Canonical World Plan

```text
+----------------------+----------------------+
| RIVER COAST          | MINE FOOTHILL        |
| south <-> forest     | south <-> village    |
| east  <-> mine       | west  <-> coast      |
+----------------------+----------------------+
| WHISPER FOREST       | FARM VILLAGE         |
| north <-> coast      | north <-> mine       |
| east  <-> village    | west  <-> forest     |
+----------------------+----------------------+
```

기존 네 연결 중 Forest와 Farm 사이의 방향만 반전한다. 월드맵 UI, 빠른 이동, 도착 방향도 이 배치를 유일한 기준으로 사용한다.

## Seam Contract

| Pair | First gate | Second gate | Width | Arrival facing |
| --- | --- | --- | --- | --- |
| Forest / Coast | Forest north `x=12..14` | Coast south `x=12..14` | 3 tiles | map interior |
| Coast / Mine | Coast east `y=13..15` | Mine west `y=13..15` | 3 tiles | map interior |
| Mine / Village | Mine south `x=11..13` | Village north `x=11..13` | 3 tiles | map interior |
| Village / Forest | Village west `y=7..9` | Forest east `y=7..9` | 3 tiles | map interior |

- 경계 길은 최소 4타일 동안 직선으로 접근한다.
- 경계에 닿는 길은 실제 출구만 허용한다.
- 사용하지 않는 가장자리는 나무, 절벽, 울타리, 해안선처럼 시각적으로 닫는다.
- 도착점은 경계에서 2타일 이상 안쪽이며 충돌, NPC, 채집물과 겹치지 않는다.
- 상호 연결은 같은 폭과 중심축을 사용한다.

## Road Hierarchy

- Primary route: 지역 출구를 연결하는 3타일 폭의 끊기지 않는 길.
- Secondary route: 건물, 농장, 채집 공터, 낚시터로 이어지는 2타일 폭의 길.
- Footpath: 숲과 광산의 선택형 탐색 루프에만 쓰는 1타일 폭의 길.
- Dead end: 반드시 건물 문, 전망대, 낚시터, 채집 공터, 광맥 중 하나로 끝난다.
- Junction: 한 화면에 큰 교차로는 하나만 두고, 나머지는 T자 분기로 정리한다.

## Region Zoning

### Farm Village

- 북쪽 광산 게이트에서 중앙 광장으로 3타일 주도로가 내려온다.
- 중앙 광장은 종, 게시판, 주민 대화와 축제의 공용 공간으로 비운다.
- 서쪽 주도로는 숲 게이트로 이어지고 시장 앞에서만 한 번 넓어진다.
- 북부는 주택과 상점, 남서부는 헛간과 목장, 남동부는 밭과 연못으로 묶는다.
- 건물 문은 보조도로를 바라보고, 건물 뒤나 울타리 안으로 주도로가 통과하지 않는다.
- 기존 6개 밭과 확장 농장 구역은 같은 농업 구역 안에 둔다.

### Whisper Forest

- 동쪽 마을 게이트에서 들어온 주도로가 중앙 다리를 지나 북쪽 해안 게이트로 꺾인다.
- 개울은 Coast의 강과 같은 축으로 이어지며 계절별 맵에서도 위치가 바뀌지 않는다.
- 서쪽 가장자리는 숲으로 닫고, 기존의 가짜 출구처럼 보이는 길을 제거한다.
- 채집 공터는 주도로에서 한 칸 떨어진 짧은 순환 보행로에 배치한다.
- 숲 NPC는 출구가 아니라 다리, 공터, 안내 표지 주변에서 머문다.

### River Coast

- 남쪽 숲 게이트에서 올라온 길이 강 서안에서 동쪽 광산 게이트로 이어진다.
- 강은 Forest에서 유입되어 해안으로 넓어지며, 물 경계는 모든 계절에 동일하다.
- 서쪽 경계의 가짜 도로는 숲 가장자리 또는 전망대로 끝낸다.
- 선착장과 낚시 구역은 주도로 옆 보조 동선으로 분리한다.
- 모래사장은 길처럼 보이지 않도록 보행 가능한 해변과 실제 출구를 명확히 구분한다.

### Mine Foothill

- 서쪽 해안 게이트에서 광산 입구 앞 작은 전이 광장으로 진입한다.
- 광장에서 남쪽 마을 게이트로 3타일 주도로가 내려간다.
- 광석과 수정은 주도로를 막지 않는 짧은 측면 루프에 둔다.
- 폐쇄 절벽 테라스는 완전히 닫고, 걸을 수 있을 것처럼 보이는 틈을 남기지 않는다.
- 광산 입구와 희귀 수정은 길 위에서 보이는 방향 표지 역할을 한다.

## Visual Continuity

- Forest와 Coast의 물길은 같은 폭, 제방 재료, 흐름 방향을 공유한다.
- Coast와 Mine의 접점은 모래 길이 자갈 길로 점진적으로 바뀐다.
- Mine과 Village의 접점은 돌계단, 랜턴, 흙길 순서로 고도가 낮아진다.
- Village와 Forest의 접점은 목재 표지, 낮은 울타리, 숲 그늘 순서로 밀도가 높아진다.
- 네 지역 모두 상단 좌측 광원, 동일한 픽셀 밀도와 외곽선 두께를 유지한다.

## Implementation Plan

### Phase 1: Geometry Contract

- `src/game/worldComposition.ts`에 월드 좌표, 경계 계약, 도로 계층을 정의한다.
- 상호 출구 방향, 폭, 중심축, 안전 도착점, 출구 간 도달성을 검사하는 RED 테스트를 먼저 추가한다.
- `openWorld.ts`가 중복 좌표 대신 이 계약을 사용하게 한다.

Acceptance criteria:

- 네 지역이 겹치지 않는 정수 월드 좌표를 가진다.
- 모든 출구는 정확히 하나의 역방향 출구를 가진다.
- 각 지역에는 경계에 닿는 실제 출구가 정확히 2개만 있다.

### Phase 2: Spring Master Maps

- 기존 Spring GPT 원본 네 장을 참조해 연속된 2x2 Spring 마스터를 만들고, 동일 비율로 네 사분면을 분할한다.
- 주요 건물과 오브젝트는 투명 스프라이트로 유지하고 배경에 굽지 않는다.
- Spring에서 충돌, 낚시 수면, 채집물, NPC, 농장 구역을 먼저 완전히 맞춘다.

Acceptance criteria:

- 네 맵을 2x2로 붙였을 때 네 접합부의 길과 물길이 끊기지 않는다.
- 출구가 아닌 경계에는 이동 가능해 보이는 틈이나 길이 없다.
- 각 지역의 두 출구 사이에 하나의 연속된 주도로가 존재한다.

### Phase 3: Gameplay Coordinates

- Village 건물, 소품, 밭, 목장, NPC 순찰을 새 구역 계획에 맞춘다.
- Forest와 Mine의 NPC 및 채집 노드를 보조 동선으로 옮긴다.
- 충돌, 상호작용, 빠른 이동, 저장 위치 복구를 새 좌표에 맞춘다.

Acceptance criteria:

- 주도로가 건물, 울타리, NPC, 채집물로 막히지 않는다.
- 모든 활동 지점은 출구를 막지 않고 걸어서 도달할 수 있다.
- 기존 저장 위치가 막힌 셀이라면 가장 가까운 주도로로 복구된다.

### Phase 4: Four Seasons

- 확정된 Spring 2x2 마스터 기하를 기준으로 Summer, Autumn, Winter 마스터를 GPT Image edit으로 만든다.
- 계절은 색, 식생, 눈, 장식만 바꾸고 길, 물, 건물 자리, 충돌은 바꾸지 않는다.
- `seasons-v1/manifest.json`에 새 원본과 런타임 해시를 기록한다.

Acceptance criteria:

- 16개 맵 모두 `512x352`다.
- 계절 전환 전후 출구, 충돌, 물, 활동 좌표가 동일하다.
- 흰색 매트, 외부 그림자, 보간 흐림이 없다.

### Phase 5: Phaser And Visual QA

- Farm -> Forest -> Coast -> Mine -> Farm 순환과 역방향 이동을 실제 플레이한다.
- MAP 화면을 canonical 2x2 배치로 바꾸고 현재 지역과 연결 도로를 표시한다.
- Desktop `1440x900`, Mobile `390x844`, 사계절 대표 화면을 검증한다.

Acceptance criteria:

- 경계 전환 전후 플레이어의 진행 방향이 자연스럽다.
- 가짜 출구, 막힌 주도로, 물 위 이동, 충돌 지형 진입이 없다.
- 콘솔 오류 0, 가로 스크롤 0, visual-verdict 90 이상이다.

## Scope Guard

- 맵 크기와 해상도는 늘리지 않는다.
- 신규 지역, 전투, 상점 확장, 새 시스템은 이번 단계에 추가하지 않는다.
- 기존 GPT 에셋과 사용자 변경을 되돌리지 않는다.
- 먼저 Spring 네 장을 승인 가능한 수준으로 완성한 뒤 다른 계절을 파생한다.
