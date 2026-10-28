// Sync the Gimhae rice observations in nbar-data.js with the drone status board.
// Source: https://kwak0426.github.io/drone/summary.json (fixed_round_counts)
// Usage: node tools/sync_drone_index.cjs [--data site/data/nbar-data.js] [--summary local.json]
// Adds missing observation dates and updates cycle counts. Other fields are left as they are.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SUMMARY_URL = 'https://kwak0426.github.io/drone/summary.json';
const SITE = '김해 농지';

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const dataPath = path.resolve(arg('--data', path.join(__dirname, '..', 'site/data/nbar-data.js')));

// Rice growth stage by observation date (agreed 2026-10-27).
function growthStage(isoDate) {
  const [, m, d] = isoDate.split('-').map(Number);
  const md = m * 100 + d;
  if (md <= 630) return '이앙기';
  if (md <= 731) return '유수형성기';
  if (md <= 915) return '출수기';
  return '등숙기';
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
        observationTime: "미확인",
        imageCount: null,
        title: "[논 벼] - ${SITE}",
        agency: "농과원 · 부산대",
        html: "reports/${isoDate}_gimhae_rice.html",
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

// [start, end) of the object literal whose date line is `date: "<date>"`.
function blockRange(text, date) {
  const at = text.indexOf(`date: "${date}"`);
  if (at < 0) return null;
  const start = text.lastIndexOf('\n    {', at) + 1;
  const end = text.indexOf('\n    }', at) + '\n    }'.length;
  return [start, end];
}

function kstStamp() {
  const kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString();
  return `${kst.slice(0, 10).replace(/-/g, '.')} ${kst.slice(11, 16)}`;
}

async function main() {
  const summaryFile = arg('--summary');
  const summary = summaryFile
    ? JSON.parse(fs.readFileSync(summaryFile, 'utf8'))
    : await (await fetch(SUMMARY_URL, { cache: 'no-store' })).json();
  const rounds = summary.fixed_round_counts;
  if (!rounds || typeof rounds !== 'object') throw new Error('summary.json has no fixed_round_counts');

  let text = fs.readFileSync(dataPath, 'utf8');
  const changes = [];

  for (const [isoDate, count] of Object.entries(rounds).sort()) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate) || !Number.isInteger(count) || count < 1) continue;
    const date = isoDate.replace(/-/g, '.');
    const observations = loadObservations(text);
    const existing = observations.find((item) => item.date === date);

    if (existing) {
      if (existing.site !== SITE || existing.cycle === `${count}회`) continue;
      const [start, end] = blockRange(text, date);
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
    const [, end] = blockRange(text, before.date);
    text = `${text.slice(0, end)},\n${entryText(isoDate, count)}${text.slice(end)}`;
    changes.push(`${date} 추가 (${growthStage(isoDate)}, ${count}회)`);
  }

  if (!changes.length) {
    console.log('변경 없음');
    return;
  }
  text = text.replace(/window\.NBAR_LAST_UPDATED = "[^"]*";/, `window.NBAR_LAST_UPDATED = "${kstStamp()}";`);
  loadObservations(text); // fail before writing if the result is not valid JavaScript
  fs.writeFileSync(dataPath, text);
  console.log(changes.join('\n'));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
