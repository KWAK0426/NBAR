// Inspect the trusted, local dashboard data without a browser or dependencies.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const site = path.join(root, 'site');
const context = { window: {} };
new vm.Script(fs.readFileSync(path.join(site, 'data/nbar-data.js'), 'utf8'))
  .runInNewContext(context, { timeout: 3000 });
const data = context.window;
const observations = data.NBAR_OBSERVATIONS;
if (!Array.isArray(observations) || !observations.length) {
  throw new Error('NBAR_OBSERVATIONS must be a non-empty array.');
}

const problems = [];
const records = [];
const dates = new Set();
const categoryCounts = {};
const expectedStages = ['자료 정리', '영상 처리', '품질 검토', 'BRDF 분석', '보고서 작성'];

for (const item of observations) {
  const cycles = Number(String(item.cycle).match(/^([0-9]+)회$/)?.[1]);
  // 같은 날짜라도 대상지가 다르면 다른 관측이다. 날짜+대상지가 겹치면 오류.
  const observationKey = `${item.date} ${item.site}`;
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(item.date) || dates.has(observationKey)) {
    problems.push(`${observationKey}: invalid or duplicate date+site key`);
  }
  dates.add(observationKey);
  if (!Number.isInteger(cycles) || cycles < 1) problems.push(`${item.date}: invalid cycle count`);
  if (item.imageCount !== null && (!Number.isInteger(item.imageCount) || item.imageCount < 1)) problems.push(`${item.date}: invalid image count`);
  if (JSON.stringify(item.processing.map(row => row[0])) !== JSON.stringify(expectedStages)) {
    problems.push(`${item.date}: unexpected processing stage names/order`);
  }
  const tarp = item.schedule.find(row => row[0] === '반사도 타프');
  if (!tarp) problems.push(`${item.date}: missing tarp row`);
  const reportState = item.processing.find(row => row[0] === '보고서 작성')?.[1];
  const reportTarget = path.resolve(site, item.html || '');
  const reportExists = Boolean(item.html && fs.existsSync(reportTarget) && fs.statSync(reportTarget).isFile());
  if (reportState !== '예정' && !reportExists) problems.push(`${item.date}: enabled report is missing`);
  // 보고서는 관측별 폴더(reports/<날짜_대상지>/index.html)에 올린다. 업로드 전에도 폴더는 있어야 한다.
  if (item.html && !fs.existsSync(path.dirname(reportTarget))) problems.push(`${item.date}: report folder is missing (${path.dirname(item.html)})`);
  for (const key of ['NBAR_MOSAIC_CYCLE_PROGRESS', 'NBAR_QUALITY_CYCLE_PROGRESS']) {
    const config = data[key] || {};
    const progress = { ...config.default, ...(config.byDate?.[`${item.date} ${item.site}`] ?? config.byDate?.[item.date]) };
    for (const field of ['panelCompletedCycles', 'elcCompletedCycles']) {
      if (!Number.isInteger(progress[field]) || progress[field] < 0 || progress[field] > cycles) {
        problems.push(`${item.date}: ${key}.${field} is outside 0..${cycles}`);
      }
    }
  }
  const mosaic = typeof item.mosaic === 'string' ? item.mosaic : item.mosaic?.src;
  if (mosaic && !fs.existsSync(path.resolve(site, mosaic))) problems.push(`${item.date}: mosaic is missing`);
  categoryCounts[item.coverType] = (categoryCounts[item.coverType] || 0) + 1;
  records.push({
    date: item.date, coverType: item.coverType, crop: item.crop, site: item.site,
    cycles, observationTime: item.observationTime, imageCount: item.imageCount,
    tarpInstalled: tarp && tarp[1] === '미확인' ? null : Boolean(tarp && tarp[1] !== '미설치'),
    report: item.html, reportState, reportExists, mosaic: mosaic || null,
  });
}

// 여러 대상지가 같은 날짜를 쓰면 날짜만 적은 byDate 키는 어느 관측인지 알 수 없다.
const sharedDates = new Set(observations.map(item => item.date)
  .filter((date, index, all) => all.indexOf(date) !== index));
for (const key of ['NBAR_MOSAIC_CYCLE_PROGRESS', 'NBAR_QUALITY_CYCLE_PROGRESS', 'NBAR_TARP_DETAILS']) {
  for (const settingKey of Object.keys(data[key]?.byDate || {})) {
    if (sharedDates.has(settingKey)) problems.push(`${key}.byDate["${settingKey}"]: 같은 날짜 관측이 여러 개라 "날짜 대상지"로 적어야 함`);
  }
}

const report = {
  lastUpdated: data.NBAR_LAST_UPDATED,
  observationCount: records.length,
  categoryCounts,
  totalCycles: records.reduce((sum, item) => sum + item.cycles, 0),
  registeredReports: records.filter(item => item.reportExists).length,
  reservedMissingReports: records.filter(item => !item.reportExists && item.reportState === '예정')
    .map(item => ({ date: item.date, path: item.report })),
  problems,
  observations: records,
};
const output = JSON.stringify(report, null, 2) + '\n';
const jsonIndex = process.argv.indexOf('--json');
if (jsonIndex !== -1) fs.writeFileSync(path.resolve(process.argv[jsonIndex + 1]), output, 'utf8');
console.log(JSON.stringify({ observationCount: report.observationCount, categoryCounts,
  totalCycles: report.totalCycles, registeredReports: report.registeredReports,
  reservedMissingReports: report.reservedMissingReports.length, problems }, null, 2));
process.exitCode = problems.length ? 1 : 0;
