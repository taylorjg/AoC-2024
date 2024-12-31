import { range, readLines, sumBy } from "../utils.mjs";

const parseFile = async (filename) => {
  const lines = await readLines(filename);

  const numConfigs = lines.length / 3;
  console.assert(numConfigs * 3 === lines.length);

  const configs = [];

  for (const i of range(numConfigs)) {
    const line1 = lines[i * 3 + 0];
    const line2 = lines[i * 3 + 1];
    const line3 = lines[i * 3 + 2];

    const m1 = line1.match(/X\+(\d+), Y\+(\d+)/);
    const m2 = line2.match(/X\+(\d+), Y\+(\d+)/);
    const m3 = line3.match(/X=(\d+), Y=(\d+)/);

    const ax = Number(m1[1]);
    const ay = Number(m1[2]);
    const bx = Number(m2[1]);
    const by = Number(m2[2]);
    const px = Number(m3[1]);
    const py = Number(m3[2]);

    const a = { x: ax, y: ay };
    const b = { x: bx, y: by };
    const prize = { x: px, y: py };

    configs.push({ a, b, prize });
  }

  return configs;
};

const tryCombination = (config, aCount, bCount) => {
  const x = config.a.x * aCount + config.b.x * bCount;
  const y = config.a.y * aCount + config.b.y * bCount;
  return x === config.prize.x && y === config.prize.y;
};

const tryToWinPrize = (config) => {
  for (const aCount of range(100)) {
    for (const bCount of range(100)) {
      if (tryCombination(config, aCount, bCount)) {
        return { result: true, a: aCount, b: bCount };
      }
    }
  }

  return { result: false };
};

const part1 = async (filename) => {
  const configs = await parseFile(filename);
  const outcomes = configs.map(tryToWinPrize);
  const successfulOutcomes = outcomes.filter(({ result }) => result);
  const total = sumBy(successfulOutcomes, (({ a, b }) => a * 3 + b));
  console.log(total);
};

const main = async () => {
  await part1("day13/example.txt");
  await part1("day13/input.txt");
};

main();
