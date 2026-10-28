# 2026-10-29: 현장관측 배치·생육시기 반영, 공통 문서 재구성, 드론 현황판 자동 갱신

- 작업자: Claude Code
- 기준 커밋: `c1c1100`

## 배경

2026-10-27 다른 Claude Code 대화에서 현장관측 페이지와 데이터를 고쳤지만 커밋하지 않았다.
작업본은 `C:\Users\inick\Documents\Codex\2026-08-01\new-chat\work\nbar_deploy_20261026`(KWAK0426/NBAR 클론, `daa093f` 기준)에 남아 있었다.
이번에 그 수정 중 아래 4개 파일을 A로 옮겼다. 그 작업본의 `site/index.html`은 10/28 2×2 허브보다 오래된 안이라 가져오지 않았다.

## 변경

- `site/field_observation.html` (10/27 작업 반영 + 10/29 보완)
  - 인덱스를 왼쪽 세로 전체로, 오른쪽은 "선택 관측 상세" 한 칸으로 통합. "선택 업무 세부" 칸 삭제.
  - 인덱스 한 줄: 날짜 · 생육시기 배지 · 대상물 · 대상지 · N회 촬영 · HTML 버튼. 글씨 크기 상향.
  - RGB 모자이크: 드론 뷰어(`kwak0426.github.io/drone/viewer/`) 섬네일 연결, 기본 1회차, 누르면 뷰어 새 탭.
  - 10/29: 760px 이하 가로 넘침(409px) 수정, 대상지 탭 글씨 축소.
- `site/data/nbar-data.js`: 벼 생육시기를 이앙기·유수형성기·출수기·등숙기로 변경, 제목 `[논 벼]`, 김해 관측 5개(8/24, 9/8, 9/21, 9/23, 10/7) 추가.
- `docs/DATA_EDITING_GUIDE.md`, `tools/check_data.cjs`: 위 데이터에 맞춘 기준표·검사(영상 수 미확인 허용).
- `site/reports/field_data_processing_method.html`: 01 공용 관측 프로토콜(파일 없음, "문서 준비 중"), 02 전처리 방법서. 결과 생성·분석 방법서는 이 목록에서 뺐다. 파일과 전처리 방법서 안의 링크는 남아 있다.
- 자동 갱신: `tools/sync_drone_index.cjs`, `.github/workflows/sync-drone-index.yml`
  - 매일 03:00 UTC(12:00 KST)에 `https://kwak0426.github.io/drone/summary.json`의 `fixed_round_counts`를 읽는다.
  - 없는 날짜는 김해 논 항목으로 추가하고, 있는 김해 항목은 사이클 수만 맞춘다. 다른 값은 건드리지 않는다.
  - 생육시기 규칙: ~6/30 이앙기, ~7/31 유수형성기, ~9/15 출수기, 이후 등숙기.
  - 바뀐 것이 있을 때만 `NBAR_LAST_UPDATED`를 갱신하고 커밋한다.
- B에도 같은 페이지·데이터를 복사했다(`noindex` 유지). B의 자동 갱신 스크립트는 `.github/scripts/`에 둔다.

## 검증

- `node tools/check_data.cjs`: 문제 0.
- `node tools/sync_drone_index.cjs`: 현재 현황판과 비교해 변경 없음. 임시 복사본에 날짜 추가·사이클 변경을 넣어 추가 위치·수정·재실행 시 변경 없음 확인.
- 로컬 브라우저: 1600·1100·375px, 7/16 선택 시 RGB 섬네일 표시, JavaScript 오류 없음, 375px 가로 넘침 없음.

## 남은 문제

- 공용 관측 프로토콜 문서(DOCX) 위치 미확인.
- 자동 추가 항목의 관측 시간·타프·영상 수는 "미확인"으로 들어간다.
- B의 RGB 섬네일도 개인 사이트(`kwak0426.github.io/drone/`)를 불러온다.
- GitHub 토큰에 `workflow` 권한이 없어 워크플로 파일은 권한 추가 후 올려야 한다.
