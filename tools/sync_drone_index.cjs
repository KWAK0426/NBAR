// Sync the Gimhae rice observations in nbar-data.js with the drone status board.
// Sources: https://kwak0426.github.io/drone/summary.json (fixed_round_counts)
//          https://kwak0426.github.io/drone/viewer/catalog.json (rounds with an RGB mosaic)
// Usage: node tools/sync_drone_index.cjs [--data site/data/nbar-data.js] [--summary local.json] [--catalog local.json]
// Adds missing observation dates, updates cycle counts and mosaicRounds. Other fields are left as they are.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SUMMARY_URL = 'https://kwak0426.github.io/drone/summary.json';
const CATALOG_URL = 'https://kwak0426.github.io/drone/viewer/catalog.json';
const SITE = '김해 농지';

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const dataPath = path.resolve(arg('--data', path.join(__dirname, '..', 'site/data/nbar-data.js')));

// Rice growth stage for a newly added date. Fixed by the user per date (2026-10-27, 10-29):
// 5/10 이앙기, 6/30 분얼기, 7/16·7/31 유수형성기, 8/24·9/8 출수기, 9/21 등숙기, 9/23·10/7 등숙기 + 수확기.
// Boundaries between those dates are a guess; existing entries are never re-staged.
function growthStage(isoDate) {
  const [, m, d] = isoDate.split('-').map(Number);
  const md = m * 100 + d;
  if (md <= 531) return '이앙기';
  if (md <= 715) return '분얼기';
  if (md <= 731) return '유수형성기';
  if (md <= 915) return '출수기';
  if (md <= 921) return '등숙기';
  return '등숙기 + 수확기';
}

// Report folder for a new observation. The folder is created with a .gitkeep so the report can be uploaded later.
function reportFolder(isoDate) {
  return `${isoDate}_gimhae_rice`;
}

function entryText(isoDate, cycles) {
  const date = isoDate.replace(/-/g, '.');
  const stage = growthStage(isoDate);
  return `    {
        date: "${date}",
        coverType: "농지",
        crop: "벼",
        site: "${SITE}",
        purpose: "${stage}",
        purposeDetail: "${stage} 벼 군락의 시간 변화 확인",
        cycle: "${cycles}회",
        mosaicRounds: [],
        observationTime: "미확인",
        imageCount: null,
        title: "[논 벼] - ${SITE}",
        agency: "부산대",
        html: "reports/${reportFolder(isoDate)}/index.html",
        status: "전처리 진행 중",
        statusClass: "progress",
        processing: [
            ["자료 정리", "완료"],
            ["영상 처리", "진행 중"],
            ["품질 검토", "예정"],
            ["BRDF 분석", "예정"],
            ["보고서 작성", "예정"]
        ],
        schedule: [
            ["날짜", "${date}", "${stage} 관측"],
            ["관측 시간", "미확인", "전체 관측 시간"],
            ["관측 사이클", "${cycles}회", "관측 사이클 수"],
            ["반사도 타프", "미확인", "타프 설치 기록 미확인"],
            ["영상 개수", "미확인", "영상 장수 미집계"]
        ]
    }`;
}

function loadObservations(text) {
  const context = { window: {} };
  new vm.Script(text).runInNewContext(context, { timeout: 3000 });
  return context.window.NBAR_OBSERVATIONS;
}

// [start, end) of the object literal with `date: "<date>"` and `site: "<site>"`.
// The same date can belong to observations at different sites, so both must match.
function blockRange(text, date, site) {
  for (let at = text.indexOf(`date: "${date}"`); at >= 0; at = text.indexOf(`date: "${date}"`, at + 1)) {
    const start = text.lastIndexOf('\n    {', at) + 1;
    const end = text.indexOf('\n    }', at) + '\n    }'.length;
    if (text.slice(start, end).includes(`site: "${site}"`)) return [start, end];
  }
  throw new Error(`no entry for ${date} ${site}`);
}

function kstStamp() {
  const kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString();
  return `${kst.slice(0, 10).replace(/-/g, '.')} ${kst.slice(11, 16)}`;
}

async function readJson(fileArg, url) {
  const file = arg(fileArg);
  if (file) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.json();
}

// date (YYYY.MM.DD) -> sorted rounds that have an RGB mosaic in the viewer
function mosaicRoundsByDate(catalog) {
  const byDate = {};
  for (const o of catalog.observations || []) {
    if (o.kind !== 'RGB' || !Number.isInteger(o.round)) continue;
    const date = String(o.date).replace(/-/g, '.');
    (byDate[date] ||= new Set()).add(o.round);
  }
  return Object.fromEntries(Object.entries(byDate).map(([date, set]) => [date, [...set].sort((a, b) => a - b)]));
}

async function main() {
  const summary = await readJson('--summary', SUMMARY_URL);
  const catalog = await readJson('--catalog', CATALOG_URL);
  const rounds = summary.fixed_round_counts;
  if (!rounds || typeof rounds !== 'object') throw new Error('summary.json has no fixed_round_counts');

  let text = fs.readFileSync(dataPath, 'utf8');
  const changes = [];

  for (const [isoDate, count] of Object.entries(rounds).sort()) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate) || !Number.isInteger(count) || count < 1) continue;
    const date = isoDate.replace(/-/g, '.');
    const observations = loadObservations(text);
    // The drone board covers the Gimhae paddy only; other sites on the same date are separate entries.
    const existing = observations.find((item) => item.date === date && item.site === SITE);

    if (existing) {
      if (existing.cycle === `${count}회`) continue;
      const [start, end] = blockRange(text, date, SITE);
      const block = text.slice(start, end)
        .replace(/cycle: "\d+회"/, `cycle: "${count}회"`)
        .replace(/\["관측 사이클", "\d+회"/, `["관측 사이클", "${count}회"`);
      text = text.slice(0, start) + block + text.slice(end);
      changes.push(`${date} 사이클 ${existing.cycle} → ${count}회`);
      continue;
    }

    // Insert after the last Gimhae entry that is earlier than this date, else after the last Gimhae entry.
    const gimhae = observations.filter((item) => item.site === SITE);
    const before = gimhae.filter((item) => item.date < date).pop() || gimhae[gimhae.length - 1];
    const [, end] = blockRange(text, before.date, SITE);
    text = `${text.slice(0, end)},\n${entryText(isoDate, count)}${text.slice(end)}`;
    changes.push(`${date} 추가 (${growthStage(isoDate)}, ${count}회)`);
  }

  const mosaics = mosaicRoundsByDate(catalog);
  for (const item of loadObservations(text).filter((entry) => entry.site === SITE)) {
    const rounds = mosaics[item.date] || [];
    if (JSON.stringify(item.mosaicRounds) === JSON.stringify(rounds)) continue;
    const [start, end] = blockRange(text, item.date, SITE);
    const line = `mosaicRounds: [${rounds.join(', ')}],`;
    let block = text.slice(start, end);
    block = /mosaicRounds: \[[^\]]*\],/.test(block)
      ? block.replace(/mosaicRounds: \[[^\]]*\],/, line)
      : block.replace(/(\n(\s*)cycle: "[^"]*",)/, `$1\n$2${line}`);
    text = text.slice(0, start) + block + text.slice(end);
    changes.push(`${item.date} 모자이크 회차 [${(item.mosaicRounds || []).join(', ')}] → [${rounds.join(', ')}]`);
  }

  if (!changes.length) {
    console.log('변경 없음');
    return;
  }
  text = text.replace(/window\.NBAR_LAST_UPDATED = "[^"]*";/, `window.NBAR_LAST_UPDATED = "${kstStamp()}";`);
  loadObservations(text); // fail before writing if the result is not valid JavaScript
  fs.writeFileSync(dataPath, text);
  // Every Gimhae entry gets its report folder. html paths are relative to the site root (data/.. in both A and B).
  const siteRoot = path.join(path.dirname(dataPath), '..');
  for (const item of loadObservations(text).filter((entry) => entry.site === SITE)) {
    const folder = path.join(siteRoot, path.dirname(item.html || ''));
    if (!item.html || fs.existsSync(folder)) continue;
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, '.gitkeep'), '');
    changes.push(`${item.date} 보고서 폴더 생성 (${path.dirname(item.html)})`);
  }
  console.log(changes.join('\n'));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
