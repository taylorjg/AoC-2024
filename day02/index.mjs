import { readLines, range, partition } from "../utils.mjs";

const parseFile = async (filename) => {
  const lines = await readLines(filename);
  const reports = lines.map((line) => line.split(/\s+/).map(Number));
  return reports;
};

const isReportSafe = (report) => {
  const count = report.length;

  const diffs = range(count - 1).map((index) => {
    const a = report[index];
    const b = report[index + 1];
    const diff = a - b;
    return diff;
  });

  const signs = diffs.map(Math.sign);
  const allIncreasing = signs.every((sign) => sign === -1);
  const allDecreasing = signs.every((sign) => sign === +1);

  if (!allIncreasing && !allDecreasing) return false;

  return diffs.every((diff) => Math.abs(diff) >= 1 && Math.abs(diff) <= 3);
};

const problemDampener = (report) => {
  const levels = report.length;

  return range(levels).some((level) => {
    const reportWithLevelRemoved = report.filter((_, index) => index !== level);
    return isReportSafe(reportWithLevelRemoved);
  });
};

const part1 = async (filename) => {
  const reports = await parseFile(filename);
  const safeReports = reports.filter(isReportSafe);
  const total = safeReports.length;
  console.log(total);
};

const part2 = async (filename) => {
  const reports = await parseFile(filename);
  const [safeReports, unsafeReports] = partition(reports, isReportSafe);
  const unsafeReportsActuallyOk = unsafeReports.filter(problemDampener);
  const total = safeReports.length + unsafeReportsActuallyOk.length;
  console.log(total);
};

const main = async () => {
  await part1("day02/example.txt");
  await part1("day02/input.txt");

  await part2("day02/example.txt");
  await part2("day02/input.txt");
};

main();
