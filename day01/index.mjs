import { readLines, sum } from "../utils.mjs";

const parseFile = async (filename) => {
  const lines = await readLines(filename);
  const pairs = lines.map((line) => line.split(/\s+/).map(Number));
  return pairs;
};

const part1 = async (filename) => {
  const pairs = await parseFile(filename);
  const firsts = pairs.map(pair => pair[0]).sort((a, b) => a - b);
  const seconds = pairs.map(pair => pair[1]).sort((a, b) => a - b);
  const diffs = firsts.map((first, index) => Math.abs(first - seconds[index]));
  const total = sum(diffs);
  console.log(total);
};

const part2 = async (filename) => {
  const pairs = await parseFile(filename);
  const firsts = pairs.map(pair => pair[0]).sort((a, b) => a - b);
  const seconds = pairs.map(pair => pair[1]).sort((a, b) => a - b);
  const similarityScores = firsts.map((first) => first * seconds.filter((second) => first === second).length);
  const total = sum(similarityScores);
  console.log(total);
};

const main = async () => {
  await part1("day01/example.txt");
  await part1("day01/input.txt");

  await part2("day01/example.txt");
  await part2("day01/input.txt");
};

main();
