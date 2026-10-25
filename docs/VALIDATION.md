# 패키지 검증 기록

확인일: 2026-10-19 (한국시간)

## 1. 파일 보존

원본 폴더 `outputs/NBAR_LATEST_HTML_20260919`에서 실행 HTML, JavaScript, 로고, 이미지, GIF를 복사했습니다. 복사한 실행 파일 각각의 SHA-256이 원본과 일치함을 확인했습니다.

변경한 것은 인수인계 Markdown과 검사용 도구입니다. 기존 README는 패키지 기준 설명으로 새로 작성했고, 메인 화면 참고 캡처는 `docs/previews/`에 정리했습니다. 원본 사이트 폴더의 파일은 이번 작업에서 수정하지 않았습니다.

`FILE_MANIFEST.csv`는 패키지 안의 파일 경로·크기·SHA-256을 기록합니다. 파일 목록 자체는 자기 자신을 제외합니다.

## 2. 정적 경로 검사

실행:

```powershell
python tools/check_links.py --json docs/static_link_check.json
```

| 검사 | 결과 |
|---|---|
| HTML 파일 | 11개 |
| 정적 로컬 링크·이미지·스크립트 참조 | 89개 |
| 없는 파일 또는 HTML anchor | 0개 |
| 외부 의존 | MathJax CDN 1종 |

이 검사는 HTML 속성의 경로와 anchor만 검사합니다. CSS의 URL, JavaScript 템플릿에서 만들어지는 링크, 이미지 내부 값의 정확성은 검사 범위 밖입니다.

## 3. JavaScript 관측자료 검사

실행:

```powershell
node tools/check_data.cjs --json docs/data_check.json
```

| 검사 | 결과 |
|---|---|
| 관측 항목 | 8개 |
| 피복 구분 | 농지 5 / 밭 1 / 나지 1 / 경사지 1 |
| 전체 사이클 | 38회 |
| 실제 연결된 개별 보고서 | 6월 10일 1개 |
| 미작성 예약 보고서 | 7개, 현재 버튼 비활성 |
| 완료 회차 범위·단계명·날짜 키 등 검사 오류 | 0개 |
| 관측 데이터의 RGB 모자이크 등록 | 없음 |

원자료를 재처리하거나 영상 수 집계 기준을 검증한 것은 아닙니다. 현재 웹 데이터의 형식과 로컬 연결 상태를 확인했습니다.

## 4. 브라우저 동작 검사

패키지의 파일을 로컬 파일 URL로 Chrome headless에서 열어 확인했습니다. 외부 HTTP/HTTPS 요청을 막은 상태로 검사했으므로 MathJax CDN의 로딩·수식 렌더링은 이번 검사에 포함하지 않았습니다.

확인한 항목:

- 메인 과업 4행, 진입 링크 4개, 본문 이미지 없음과 헤더 로고 1개.
- 1440×900, 390×844 화면에서 메인의 가로 넘침 없음.
- 유형별 탭과 8개 날짜의 선택.
- 각 관측에서 자료 정리·영상 처리·품질 검토·BRDF 분석·보고서 작성 선택.
- 관측을 바꿨을 때 자료 정리로 기본 업무 초기화.
- 타프 없는 날, 영상 처리·품질 검토 ELC의 대상 아님 표시.
- 7월 31일의 5회·09:55~14:42·5,834장 표시.
- 6월 10일의 NIAS 타프 상세와 결과 보고서의 새 탭 열기.
- 사이트 HTML 11개의 로딩과 제목 존재, 미처리 JavaScript 예외 없음.

기계 판독 결과는 `browser_check.json`에 있습니다. `docs/previews/main_packaged_desktop.png`, `main_packaged_mobile.png`는 이번 패키지에서 직접 촬영한 화면입니다. `main_rows_preview.png`, `main_rows_mobile_preview.png`는 기존 2026-09-30 캡처입니다.

## 5. 발견한 기존 이미지 문제

두 보고서에서 동일한 내장 PNG 세 종류가 디코딩되지 않았습니다.

| 보고서 | 표시되지 않는 이미지의 alt |
|---|---|
| `site/reports/2026-06-10_field_result_report.html` | Case 04 Tarp-wise Error / Case 08 Tarp-wise error / Case 09 band-wise error |
| `site/reports/2026-06-10_joint_field_elc_mosaic_report.html` | 같은 3종 |

외부 이미지 파일이 빠진 것이 아니라 기존 HTML 내부의 base64 이미지 문제입니다. 원본 파일과 이번 사본의 해시는 같습니다. 검증 결과를 그대로 남기며, 실제 그림을 임의 생성·대체하지 않았습니다.

확대 모달용으로 src가 비어 있는 이미지 요소 두 개는 검사에서 제외했습니다. 내장 SVG 세 개는 XML 검사상 정상이었고 브라우저에서 깨진 이미지로 판정되지 않았습니다. 두 보고서의 UTF-8 원문에서 Unicode replacement character(U+FFFD)는 0개였습니다. 터미널 출력의 인코딩만으로 본문이 손상되었다고 판정하지 않았습니다.

추가 기록: `embedded_image_check.json`.

## 6. 이번 검사의 한계

- 실제 GitHub 로그인·쓰기권한·브랜치·Pages 배포 설정은 확인하지 않았습니다.
- GitHub에 push·업로드·배포하지 않았습니다.
- 개별 HTML 보고서의 모든 과학적 수치·캡션·수식은 재검증하지 않았습니다.
- 실제 UAV 원영상, 방사보정계수, RAMSES Ed, GeoTIFF·DEM 원본은 포함하거나 처리하지 않았습니다.
- 공용 프로토콜, 미작성 보고서, 관리 UI, 2~4번 과업 데이터는 새로 구현하지 않았습니다.
- 화면의 상태·완료 수는 기존 기록을 유지했으며, 실제 연구 진행률을 추정해 갱신하지 않았습니다.
- 간편 보고서 편집기(`tools/html_report_editor_tool.html`)는 기존 선택 도구를 함께 넣은 것으로 이번 브라우저 검사 대상은 아닙니다.

사이트 기본 탐색과 대시보드 동작을 확인한 인수인계 사본입니다. 위의 기존 이미지 문제와 미구현 범위를 다음 작업에서 검토하면 됩니다.
