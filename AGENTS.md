# NBAR: Codex / Claude Code 공동 작업

## 작업 시작 전

1. 이 저장소의 원격이 `KWAK0426/NBAR`인지 확인한다. 현재 시험 배포 대상이다.
2. `git status --short`로 기존 변경을 확인한다. 깨끗한 경우 `git pull --ff-only`로 최신화한다. 변경이 있으면 덮어쓰거나 자동 stash하지 않는다.
3. `docs/COORDINATION.md`, `docs/updates/`의 최신 기록, `git log -5 --oneline`을 읽는다.
4. 화면·자료를 바꾸기 전 `CLAUDE.md`, `docs/DATA_EDITING_GUIDE.md`와 관련 파일을 읽는다. 두 도구는 같은 기준을 사용한다.

## 현재 경계

- 편집 대상은 `site/`이다. 루트 `index.html`은 `site/`로 연결하는 진입 파일이다.
- 연구 현황 홈페이지이며 별도 드론 관리 현황판이나 영상 처리 실행기가 아니다.
- 기존 루트 `report_0630_joint_campaign.html` 및 `01_htmls/`는 보존한다.
- 관측 수치·회차·처리 실적을 추정으로 바꾸지 않는다. 배포일을 `NBAR_LAST_UPDATED`에 대입하지 않는다.
- 현재는 사용자 GitHub에서 시험한다. 교수님 저장소 `wonk19/NBAR`는 별도 요청 전 수정·배포하지 않는다.
- 원본 Photos, GPS 목록, DEM/GeoTIFF, 인증정보, 개인 PC 절대경로는 커밋하지 않는다.

## 수정 및 공유

- 관련 파일만 수정한다. 다른 도구나 사용자의 변경을 되돌리지 않는다.
- 동시에 작업하면 별도 브랜치와 PR을 사용한다. 같은 파일 작업이 겹치면 최신 원격 변경을 먼저 비교한다. force push하지 않는다.
- 검증: `python tools/check_links.py`, `node tools/check_data.cjs`. UI 변경 시 데스크톱·모바일에서 확인한다.
- `docs/updates/YYYY-MM-DD_짧은-주제.md`에 작업자, 변경 파일, 검증 결과, 남은 문제, 배포 상태를 남긴다. 같은 날 다른 작업은 별도 파일을 만든다.
- 다음 도구가 알아야 할 현재 상태·결정은 `docs/COORDINATION.md`에도 반영한다.
- 커밋·push·실제 공개 주소 확인을 구분한다. URL이 열리고 새 내용이 확인될 때만 배포 확인으로 기록한다.
- 이 기록은 Git을 통해 공유된다. 다른 채팅에 자동 알림이나 지시가 전송되는 것은 아니다.
