import { readLines, range, sum } from "../utils.mjs";

const parseFile = async (filename) => {
  const lines = await readLines(filename);
  return lines;
};

const verticals = (lines) => {
  const rows = lines.length;
  const cols = lines[0].length;
  return range(cols).map((col) => range(rows).map((row) => lines[row][col]).join(""));
};

const diagonalsLTR = (lines) => {
  console.assert(lines.length === lines[0].length);
  const n = lines.length;
  const diagonalCount = 2 * n - 1;
  const resultLines = [];
  for (const diagonalIndex of range(diagonalCount)) {
    const resultLineChars = [];
    for (const row of range(n)) {
      for (const col of range(n)) {
        if (row + col === diagonalIndex) {
          resultLineChars.push(lines[row][col]);
        }
      }
    }
    const resultLine = resultLineChars.join("");
    resultLines.push(resultLine);
  }
  return resultLines;
};

const diagonalsRTL = (lines) => {
  console.assert(lines.length === lines[0].length);
  const n = lines.length;
  const diagonalCount = 2 * n - 1;
  const resultLines = [];
  for (const diagonalIndex of range(diagonalCount)) {
    const resultLineChars = [];
    for (const row of range(n)) {
      for (const col of range(n)) {
        if (n - 1 - col + row === diagonalIndex) {
          resultLineChars.push(lines[row][col]);
        }
      }
    }
    const resultLine = resultLineChars.join("");
    resultLines.push(resultLine);
  }
  return resultLines;
};

const reverse = (s) => Array.from(s).reverse().join("");

const countMatches = (lines) => {
  const countsPerLine = lines.map((line) => Array.from(line.matchAll(/XMAS/g)).length);
  return sum(countsPerLine);
};

const part1 = async (filename) => {
  const lines1 = await parseFile(filename);
  const lines2 = verticals(lines1);
  const lines3 = diagonalsLTR(lines1);
  const lines4 = diagonalsRTL(lines1);
  const lines5 = lines1.map(reverse);
  const lines6 = lines2.map(reverse);
  const lines7 = lines3.map(reverse);
  const lines8 = lines4.map(reverse);
  const countsPerSetOfLines = [lines1, lines2, lines3, lines4, lines5, lines6, lines7, lines8].map(countMatches);
  const total = sum(countsPerSetOfLines);
  console.log(total);
};

const getWord1 = (lines, row, col) => {
  const chars = [];
  chars.push(lines[row + 0][col + 0]);
  chars.push(lines[row + 1][col + 1]);
  chars.push(lines[row + 2][col + 2]);
  return chars.join("");
};

const getWord2 = (lines, row, col) => {
  const chars = [];
  chars.push(lines[row + 0][col + 2]);
  chars.push(lines[row + 1][col + 1]);
  chars.push(lines[row + 2][col + 0]);
  return chars.join("");
};

const part2 = async (filename) => {
  const lines = await parseFile(filename);
  const rows = lines.length;
  const cols = lines[0].length;
  let total = 0;
  for (const row of range(rows - 2)) {
    for (const col of range(cols - 2)) {
      const word1 = getWord1(lines, row, col);
      const word2 = getWord2(lines, row, col);
      const masCount = [word1, word2].filter((word) => word === "MAS" || word === "SAM").length;
      if (masCount === 2) total++;
    }
  }
  console.log(total);
}

const main = async () => {
  await part1("day04/example.txt");
  await part1("day04/input.txt");

  await part2("day04/example.txt");
  await part2("day04/input.txt");
};

main();
