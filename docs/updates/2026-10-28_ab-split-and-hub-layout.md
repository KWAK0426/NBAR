# 2026-10-28: A(작업용)·B(배포용 샘플) 분리와 허브 2×2 개편

- 작업자: Claude Code
- 요청: 작업용과 외부 공유용을 별도 주소로 구분. 이 저장소(`KWAK0426/NBAR`)를 A로 사용. 공유용 메인은 현황 허브.
- 기준 커밋: `daa093f`.

## 결정

| 구분 | 저장소 | 주소 | 용도 |
|---|---|---|---|
| A | `KWAK0426/NBAR` (이 저장소) | <https://kwak0426.github.io/NBAR/> | 사용자 작업용 전체본. 내부 자료 포함 |
| B | `KWAK0426/PNU_QUREOS_NBAR_B` | <https://kwak0426.github.io/PNU_QUREOS_NBAR_B/> | 공동 연구기관 배포용 샘플 |

- 최종 배포는 교수님 GitHub에서 할 예정. 이식 대상은 B 구성이다.
- A도 Pages로 공개되어 있어 주소를 아는 사람은 열 수 있다. 외부에는 B 주소만 전달한다.
- B는 저장소 루트가 사이트다(`site/` 폴더 없음). 모든 페이지에 `noindex`, `robots.txt` Disallow.
- B 제외 항목: `image_inventory.html`, `assets/method_candidates/`, `assets/field_observation_thumb.png`,
  6/10 분리 전 합본, 루트 `report_0630_joint_campaign.html`·`01_htmls/`, `docs/`, `tools/`, 인수인계 문서.
- 같은 날 임시로 만든 비공개 저장소 `KWAK0426/PNU_QUREOS_NBAR_A`는 이 저장소로 A를 정하면서 쓰지 않는다.

## 변경 파일

- `site/index.html`
  - 과업 4개를 2×2 칸으로 배치(760px 이하 1열). 과업명·상태 가운데 정렬.
  - 설명과 메모를 칸 안 박스로 묶음. 같은 줄 칸끼리 박스 위치를 맞추기 위해 CSS subgrid 사용.
  - 버튼 제거. 칸 전체가 링크(`<a class="task-card">`)이고 오른쪽 위 원형 화살표, 마우스 올림 시 과업 색 테두리·배경으로 표시.
  - 제목·설명 줄바꿈을 단어 단위(`word-break: keep-all`)로.
  - A 전용: 제목 옆 "A · 개인 작업본" 배지, 하단 "내부 자료" 칸(B 미리보기, 이미지 후보, 6/10 합본, 기존 공동 캠페인 보고서, 인수인계·데이터 수정 문서, 공동 작업 현황).
- B에는 위 화면 개편을 같게 반영하고 A 전용 배지·내부 자료 칸만 뺐다. 10/25 `site/field_observation.html` 모바일 수정도 B에 반영했다.

## 검증

- `node tools/check_data.cjs`: 관측 8개, 38사이클, 문제 0.
- `python tools/check_links.py`: 내부 자료 칸의 `../report_0630_joint_campaign.html`, `../docs/*.md` 3개가
  "site 밖 경로"로 표시된다. Pages가 저장소 루트를 게시하므로 의도한 경로이며, 로컬 서버(저장소 루트 기준)에서 모두 HTTP 200 확인.
- 로컬 브라우저: 1440·907·375px에서 가로 넘침 없음, 칸 빈 곳 클릭 시 해당 페이지 이동, JavaScript 오류 없음.

## 남은 문제

- 보고서 7개 미작성, 6/10 보고서 손상 PNG 3종은 그대로(A·B 공통).
- A·B 공통 파일(과업 페이지, 현장관측, `nbar-data.js`, 방법서, 6/10 결과 보고서)은 수동 복사로 맞춘다.
  A에서 먼저 고친 뒤 B에 복사하고, B 쪽에는 `noindex` 태그를 유지한다.
- B 루트에는 `index.html` 진입 파일이 따로 없으므로 경로가 A(`site/` 기준)와 한 단계 다르다.

## 배포 상태

push 후 A 공개 주소 확인 결과는 `docs/COORDINATION.md`에 기록한다.
