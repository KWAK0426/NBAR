# 관측별 HTML 보고서 업로드 안내

현장관측 페이지의 각 관측 줄 오른쪽 HTML 버튼은 그 관측의 보고서 폴더를 가리킨다.
폴더에 `index.html`이 있으면 버튼이 자동으로 "HTML 열기"가 된다. 버튼 색은 `site/data/nbar-data.js`의 해당 관측 값으로 정한다.

- 완성 전(공통 양식, 작성 중 포함): `reportComplete: false` → 회색빛 버튼
- 완성된 보고서: `reportComplete: true` → 파란 버튼

값을 바꾼 뒤 `field_observation.html`의 `nbar-data.js?v=` 값을 올린다.

## 1. 어디에 올리나

A 저장소(`KWAK0426/NBAR`) 기준 경로:

| 관측 | 대상지 | 올릴 위치 |
|---|---|---|
| 2026.05.07 | 밀양 부속농장 | `site/reports/2026-05-07_miryang_field/index.html` |
| 2026.05.10 | 강서구 논 필지 | `site/reports/2026-05-10_gimhae_rice/index.html` |
| 2026.05.15 | 김해 밭 | `site/reports/2026-05-15_gimhae_cabbage/index.html` |
| 2026.06.10 | 농업위성센터 | 이미 공개됨: `site/reports/2026-06-10_field_result_report.html` (주소 유지, 폴더 없음) |
| 2026.06.12 | 금정산 북문 | `site/reports/2026-06-12_geumjeongsan_slope/index.html` |
| 2026.06.30 | 강서구 논 필지 | `site/reports/2026-06-30_gimhae_rice/index.html` |
| 2026.07.16 | 강서구 논 필지 | `site/reports/2026-07-16_gimhae_rice/index.html` |
| 2026.07.31 | 강서구 논 필지 | `site/reports/2026-07-31_gimhae_rice/index.html` |
| 2026.08.24 | 강서구 논 필지 | `site/reports/2026-08-24_gimhae_rice/index.html` |
| 2026.09.08 | 강서구 논 필지 | `site/reports/2026-09-08_gimhae_rice/index.html` |
| 2026.09.21 | 강서구 논 필지 | `site/reports/2026-09-21_gimhae_rice/index.html` |
| 2026.09.23 | 강서구 논 필지 | `site/reports/2026-09-23_gimhae_rice/index.html` |
| 2026.10.07 | 강서구 논 필지 | `site/reports/2026-10-07_gimhae_rice/index.html` |

- 파일 이름은 반드시 `index.html`이다. 다른 이름이면 버튼이 켜지지 않는다.
- 폴더 안의 `.gitkeep`은 빈 폴더를 GitHub에 남기기 위한 빈 파일이다. 지우지 않아도 된다.
- 위 표에 없는 관측의 폴더는 `site/data/nbar-data.js`의 해당 항목 `html` 값을 보면 된다.
- 드론 현황판 자동 갱신으로 새 강서구 논 관측이 추가되면 `site/reports/YYYY-MM-DD_gimhae_rice/` 폴더도 같이 만들어진다.

## 2. 보고서 파일 규칙

- 이미지·CSS·JS를 따로 두면 같은 폴더 안에 넣고 상대경로(`figures/map.png`)로 연결한다. 개인 PC 절대경로를 쓰지 않는다.
- 공통 방법서로 연결할 때는 한 단계 위를 가리킨다: `../field_data_preprocessing_method.html`.
- 파일 하나가 50MB를 넘으면 GitHub가 경고하고, 100MB를 넘으면 올라가지 않는다. GitHub 웹 화면 업로드는 25MB까지다.
- 원본 Photos, GPS 목록, DEM/GeoTIFF는 올리지 않는다.

## 3. B(배포용 샘플)에도 올리기

외부 공유 주소는 B(`KWAK0426/PNU_QUREOS_NBAR_B`)다. A에서 확인한 뒤 같은 폴더를 B에 복사한다.

- B 경로는 `site/` 없이 `reports/<같은 폴더>/index.html`이다.
- B의 HTML에는 `<meta charset=...>` 바로 다음 줄에 `<meta name="robots" content="noindex, nofollow">`를 넣는다(B 모든 페이지 규칙).
- 내부 전용 자료가 들어간 보고서는 B에 올리지 않는다.

## 4. 확인

1. `node tools/check_data.cjs`: `problems`가 비어 있어야 한다(보고서 폴더가 없으면 오류).
2. 로컬 확인: `python -m http.server 8000 --bind 127.0.0.1 --directory site` 후 `http://127.0.0.1:8000/field_observation.html`에서 해당 관측 버튼이 "HTML 열기"인지, 새 탭으로 열리는지 본다.
   파일을 브라우저로 직접 열면(`file://`) 존재 확인이 안 되어 버튼이 열리지 않는 회색빛 "HTML"로 보인다. 반드시 서버로 연다.
3. push 후 공개 주소(A: https://kwak0426.github.io/NBAR/site/field_observation.html, B: https://kwak0426.github.io/PNU_QUREOS_NBAR_B/field_observation.html)에서 같은 확인을 한다.
4. `docs/updates/`에 올린 보고서와 확인 결과를 기록한다.

## 날짜별 자료 정리 기준 (2026-11-13)

드라이브에서는 공통 양식과 대상지별 자료를 분리하고, 대상지 아래 `YYYY-MM-DD/`마다 `01_보고서 입력자료`, `02_보고서용 이미지·그래프`, `03_결과보고서`를 둔다. 기존 뷰어 자료 폴더는 자동 갱신을 위해 기존 위치에 두고 해당 날짜에서 연결한다.

GitHub에는 기존 `site/reports/`의 날짜별 경로와 현황판 연결을 유지하며, 공개가 승인된 HTML과 표시용 자료만 올린다. 드라이브 폴더를 만드는 것과 보고서를 완성·게시하는 것은 별개다. 날짜별 폴더 생성 및 자료 읽기·보고서 작성 자동화는 아직 구현·검증되지 않았다. 공통 HTML v04와 입력 엑셀 v10은 초안이다.

2026-11-13 현황판 기준 모든 피복의 8개 대상지, 20개 대상지·관측일에 위 보고서 작업 폴더를 마련했다. 피복은 논·밭·나지·경사지이며 관측 기관이 다른 대상지도 각각 구분한다. 자료 확보·공개 승인·보고서 완성은 날짜별로 별도 확인한다.
