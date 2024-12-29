import { range, readLines } from "../utils.mjs";

const parseFile = async (filename) => {
  const lines = await readLines(filename);
  return lines.map((line) => Array.from(line));
};

const findStart = (grid) => {
  const row = grid.findIndex((line) => line.includes("^"));
  const col = grid[row].findIndex((ch) => ch === "^");
  return { row, col };
};

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

const forward = (pos, direction) => {
  const { row, col } = pos;
  switch (direction) {
    case UP: return { row: row - 1, col };
    case DOWN: return { row: row + 1, col };
    case LEFT: return { row, col: col - 1 };
    case RIGHT: return { row, col: col + 1 };
  }
};

const turnRight = (direction) => (direction + 1) % 4;

const findRoute = (grid, start) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const locations = [start];
  let currentPos = start;
  let direction = UP;
  for (; ;) {
    const newPos = forward(currentPos, direction);
    if (newPos.row < 0 || newPos.col < 0 || newPos.row >= rows || newPos.col >= cols) break;
    if (grid[newPos.row][newPos.col] === "#") {
      direction = turnRight(direction);
    } else {
      locations.push(newPos);
      currentPos = newPos;
    }
  }
  return locations;
};

const part1 = async (filename) => {
  const grid = await parseFile(filename);
  const start = findStart(grid);
  const locations = findRoute(grid, start);
  const set = new Set(locations.map(({ row, col }) => `${row}:${col}`));
  console.log(set.size);
};

const gridHasLoop = (grid, start) => {
  const rows = grid.length;
  const cols = grid[0].length;
  let currentPos = start;
  let direction = UP;
  const locations = [{ ...currentPos, direction }];
  for (; ;) {
    const newPos = forward(currentPos, direction);
    if (newPos.row < 0 || newPos.col < 0 || newPos.row >= rows || newPos.col >= cols) break;
    if (grid[newPos.row][newPos.col] === "#") {
      direction = turnRight(direction);
    } else {
      if (locations.some((l) => l.row === newPos.row && l.col === newPos.col && l.direction === direction)) return true;
      locations.push({ ...newPos, direction });
      currentPos = newPos;
    }
  }
  return false;
};

const part2 = async (filename) => {
  const grid = await parseFile(filename);
  const start = findStart(grid);
  const locations = findRoute(grid, start);

  const map = new Map(locations.map((l) => [`${l.row}:${l.col}`, l]));
  const uniqueLocations = Array.from(map.values());

  let numLoops = 0;

  for (const { row, col } of uniqueLocations) {
    if (grid[row][col] !== ".") continue;
    grid[row][col] = "#";
    console.log(`trying ${row},${col} (${numLoops})`);
    if (gridHasLoop(grid, start)) numLoops++;
    grid[row][col] = ".";
  }

  console.log(numLoops);
};

const main = async () => {
  await part1("day06/example.txt");
  await part1("day06/input.txt");

  await part2("day06/example.txt");
  await part2("day06/input.txt");
};

main();
