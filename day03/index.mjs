import { readLines, sum } from "../utils.mjs";

const parseFile = async (filename) => {
  const lines = await readLines(filename);
  return lines.join(``);
};

const processInstructions = (instructions) => {
  const matches = Array.from(instructions.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g));
  const values = matches.map((match) => Number(match[1]) * Number(match[2]));
  const total = sum(values);
  return total;
};

const part1 = async (filename) => {
  const line = await parseFile(filename);
  const total = processInstructions(line);
  console.log(total);
};

const part2 = async (filename) => {
  const line = await parseFile(filename);
  const dosDonts = Array.from(line.matchAll(/do\(\)|don't\(\)/g));
  const parts = dosDonts.map((match, index) => {
    const instructions = line.substring(match.index, dosDonts[index + 1]?.index ?? Infinity);
    return { instructions, include: match[0] === "do()" };
  });
  parts.unshift({ instructions: line.substring(0, dosDonts[0].index), include: true });

  const values = parts.filter(({ include }) => include).map(({ instructions }) => processInstructions(instructions));
  const total = sum(values);
  console.log(total);
};

const main = async () => {
  await part1("day03/example1.txt");
  await part1("day03/input.txt");

  await part2("day03/example2.txt");
  await part2("day03/input.txt");
};

main();
