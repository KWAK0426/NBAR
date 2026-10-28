# 관측별 HTML 보고서 업로드 안내

현장관측 페이지의 각 관측 줄 오른쪽 HTML 버튼은 그 관측의 보고서 폴더를 가리킨다.
폴더에 `index.html`이 올라가면 버튼이 자동으로 "HTML 준비 중" → "HTML 열기"로 바뀐다.
데이터 파일(`nbar-data.js`)이나 업무 단계 값은 고치지 않아도 된다.

## 1. 어디에 올리나

A 저장소(`KWAK0426/NBAR`) 기준 경로:

| 관측 | 대상지 | 올릴 위치 |
|---|---|---|
| 2026.05.07 | 밀양 부속농장 | `site/reports/2026-05-07_miryang_field/index.html` |
| 2026.05.10 | 김해 농지 | `site/reports/2026-05-10_gimhae_rice/index.html` |
| 2026.05.15 | 김해 밭 | `site/reports/2026-05-15_gimhae_cabbage/index.html` |
| 2026.06.10 | 농업위성센터 | 이미 공개됨: `site/reports/2026-06-10_field_result_report.html` (주소 유지, 폴더 없음) |
| 2026.06.12 | 금정산 북문 | `site/reports/2026-06-12_geumjeongsan_slope/index.html` |
| 2026.06.30 | 김해 농지 | `site/reports/2026-06-30_gimhae_rice/index.html` |
| 2026.07.16 | 김해 농지 | `site/reports/2026-07-16_gimhae_rice/index.html` |
| 2026.07.31 | 김해 농지 | `site/reports/2026-07-31_gimhae_rice/index.html` |
| 2026.08.24 | 김해 농지 | `site/reports/2026-08-24_gimhae_rice/index.html` |
| 2026.09.08 | 김해 농지 | `site/reports/2026-09-08_gimhae_rice/index.html` |
| 2026.09.21 | 김해 농지 | `site/reports/2026-09-21_gimhae_rice/index.html` |
| 2026.09.23 | 김해 농지 | `site/reports/2026-09-23_gimhae_rice/index.html` |
| 2026.10.07 | 김해 농지 | `site/reports/2026-10-07_gimhae_rice/index.html` |

- 파일 이름은 반드시 `index.html`이다. 다른 이름이면 버튼이 켜지지 않는다.
- 폴더 안의 `.gitkeep`은 빈 폴더를 GitHub에 남기기 위한 빈 파일이다. 지우지 않아도 된다.
- 위 표에 없는 관측의 폴더는 `site/data/nbar-data.js`의 해당 항목 `html` 값을 보면 된다.
- 드론 현황판 자동 갱신으로 새 김해 관측이 추가되면 `site/reports/YYYY-MM-DD_gimhae_rice/` 폴더도 같이 만들어진다.

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
   파일을 브라우저로 직접 열면(`file://`) 존재 확인이 안 되어 버튼이 계속 "준비 중"이다. 반드시 서버로 연다.
3. push 후 공개 주소(A: https://kwak0426.github.io/NBAR/site/field_observation.html, B: https://kwak0426.github.io/PNU_QUREOS_NBAR_B/field_observation.html)에서 같은 확인을 한다.
4. `docs/updates/`에 올린 보고서와 확인 결과를 기록한다.
