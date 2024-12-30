import { isEven, range, readLines } from "../utils.mjs";

const parseFile = async (filename) => {
  const [line] = await readLines(filename);
  return line.split(/\s/).map(Number);
};

const blink = (stones) => {
  return stones.flatMap((stone) => {
    if (stone === 0) return [1];

    const stoneAsString = stone.toString();
    const numDigits = stoneAsString.length;

    if (isEven(numDigits)) {
      const midPoint = numDigits / 2;
      return [
        Number(stoneAsString.slice(0, midPoint)),
        Number(stoneAsString.slice(midPoint)),
      ];
    }

    return [stone * 2024];
  });
};

const part1 = async (filename) => {
  let stones = await parseFile(filename);
  for (const _ of range(75)) {
    stones = blink(stones);
  }
  console.log(stones.length);
};

const main = async () => {
  await part1("day11/example.txt");
  await part1("day11/input.txt");
};

main();
