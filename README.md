# NBAR 홈페이지 · Claude Code 인수인계 패키지

## 현재 공동 작업 및 시험 배포 (2026-10-26)

- 소스: <https://github.com/KWAK0426/NBAR>
- 사용자 시험 사이트: <https://kwak0426.github.io/NBAR/>
- Codex·Claude Code 모두 [AGENTS.md](AGENTS.md)와 [공동 작업 현황](docs/COORDINATION.md)을 먼저 읽습니다.
- 변경 기록은 [docs/updates/](docs/updates/)에 작업별로 남깁니다.
- 실행 파일은 `site/`에서 수정합니다. 루트 `index.html`이 `./site/`로 연결합니다.
- 교수님 저장소 이식은 시험 확인 후 별도 진행합니다.

아래는 2026-10-19 패키징 당시의 안내입니다. 현재 배포 구성은 위 공동 작업 현황을 우선합니다.

패키지 작성일: 2026-10-19 (한국시간)

이 폴더 전체를 Claude Code에서 열면, 기존 홈페이지와 지금까지의 결정사항을 함께 이어서 작업할 수 있습니다. 사이트 시작 파일은 `site/index.html`입니다.

## 먼저 할 일

1. 압축파일을 받았다면 먼저 압축을 풉니다.
2. 이 `README.md`와 `CLAUDE.md`가 있는 폴더 전체를 Claude Code에서 엽니다.
3. 아래 시작 요청을 전달합니다.
4. 브라우저에서 `site/index.html`을 열어 현재 화면을 확인합니다.

Claude Code에 전달할 시작 요청:

```text
CLAUDE.md, docs/WEBSITE_HANDOFF.md, docs/DATA_EDITING_GUIDE.md,
docs/VALIDATION.md를 먼저 읽고 site/index.html에서 전체 페이지 연결을 확인해줘.
현재 파일과 합의된 디자인·데이터를 기준으로 내가 요청하는 부분을 수정해줘.
문서에서 미구현 또는 확인 필요로 분류한 부분을 완료된 것으로 가정하지 말고,
실제 관측값이나 처리 완료 회차를 임의로 바꾸지 마.
```

## 들어 있는 것

| 경로 | 역할 |
|---|---|
| `site/` | 홈페이지 실행·배포 파일 전체 |
| `CLAUDE.md` | Claude Code가 먼저 읽을 프로젝트 작업 기준 |
| `docs/WEBSITE_HANDOFF.md` | 목적, 페이지 구조, 디자인 결정, 미구현 사항 |
| `docs/DATA_EDITING_GUIDE.md` | 관측값·상태·회차·보고서·모자이크 수정법과 현재 기준표 |
| `docs/VALIDATION.md` | 이번 패키지 검증 결과와 확인 범위 |
| `docs/FILE_MANIFEST.csv` | 패키지 파일별 크기와 SHA-256 |
| `docs/previews/` | 2026-09-30 메인 화면의 데스크톱·모바일 참고 캡처 |
| `tools/check_links.py` | Python 표준 라이브러리로 로컬 HTML 링크 확인 |
| `tools/check_data.cjs` | Node.js 기본 기능으로 데이터·회차·보고서 경로 확인 |
| `tools/html_report_editor_tool.html` | 기존 HTML 보고서를 불러와 사본으로 저장하는 선택 도구 |

## 사이트 열기

별도 설치나 빌드 없이 `site/index.html`을 더블클릭하면 됩니다. 수식 페이지의 MathJax는 외부 CDN을 이용하므로 수식 렌더링에는 인터넷 연결이 필요합니다.

로컬 서버를 사용하는 경우, 패키지 최상위에서 다음 명령을 실행합니다.

```powershell
python -m http.server 8000 --bind 127.0.0.1 --directory site
```

브라우저 주소: <http://127.0.0.1:8000/>

파일 링크 검사는 다음 명령으로 실행합니다.

```powershell
python tools/check_links.py
node tools/check_data.cjs
```

## GitHub에 적용할 때

대상으로 이야기한 저장소는 <https://github.com/wonk19/NBAR>, 사이트는 <https://wonk19.github.io/NBAR/>입니다. 이번 작업에서는 원격 저장소 내용·접근권한·배포 설정을 확인하거나 변경하지 않았습니다.

- 저장소 루트가 배포 위치라면 `site` 폴더 **안의 내용**을 그 위치에 둡니다.
- `site` 폴더 자체를 루트에 올리면 기본 주소에서 `index.html`을 못 찾을 수 있습니다.
- 실제 배포 소스가 `/docs` 또는 GitHub Actions이면 해당 설정에 맞춰 배치합니다.
- `data/`, `assets/`, `reports/`의 상대 경로를 유지합니다.
- 패키지 최상위의 `CLAUDE.md`, `docs/`, `tools/`는 인수인계용이며 웹 배포에 필수는 아닙니다.
- 기존 저장소의 다른 파일과 보고서를 일괄 삭제하지 말고 변경할 파일을 비교합니다.
- 권한이 제한되어 있다면 작업 브랜치와 Pull Request로 반영할 수 있습니다. 병합·배포 가능 여부는 해당 저장소에서 확인해야 합니다.

## 버전과 범위

이 대화에서 수정한 `outputs/NBAR_LATEST_HTML_20260919`를 기준으로 묶었습니다. 메인 화면은 2026-09-30의 간결한 세로 4행 버전이고, 전처리 방법서는 2026-09-20의 0·1·2단계 버전입니다.

실제 화면의 `최신 업데이트` 값은 데이터 파일에 기록된 `2026.09.20 15:51`을 보존했습니다. 패키지 작성일과 관측자료 갱신일은 다릅니다.

자료를 처리하는 Python 파이프라인, UAV 원영상·DEM·GeoTIFF 원본, 다른 작업에서 만든 별도의 마스터 대시보드는 이 패키지에 포함하지 않았습니다. 이번 파일들은 **연구 현황 공유 홈페이지**의 작업 사본입니다.
