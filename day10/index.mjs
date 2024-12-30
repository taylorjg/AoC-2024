import { readGrid, range, sum, last, groupBy, uniqueValuesBy } from "../utils.mjs";

const parseFile = async (filename) => {
  const grid = await readGrid(filename);
  const rows = grid.length;
  const cols = grid[0].length;

  for (const row of range(rows)) {
    for (const col of range(cols)) {
      grid[row][col] = Number(grid[row][col]);
    }
  }

  return grid;
};

const findTrailheads = (grid) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const trailheads = [];

  for (const row of range(rows)) {
    for (const col of range(cols)) {
      if (grid[row][col] === 0) {
        trailheads.push({ row, col });
      }
    }
  }

  return trailheads;
};

const calculateScore = (grid, trailhead, wantUniqueDestinations) => {
  const rows = grid.length;
  const cols = grid[0].length;

  const isWithinBounds = (pos) => pos.row >= 0 && pos.col >= 0 && pos.row < rows && pos.col < cols;

  const getValidNeighbours = (pos, nextDigit) => {
    const { row, col } = pos;

    const up = { row: row - 1, col };
    const down = { row: row + 1, col };
    const left = { row, col: col - 1 };
    const right = { row, col: col + 1 };

    return [up, down, left, right]
      .filter(isWithinBounds)
      .filter((p) => grid[p.row][p.col] === nextDigit);
  };

  const helper = (pos, nextDigit, path, paths) => {
    if (nextDigit > 9) {
      paths.push(path);
      return;
    };

    const ns = getValidNeighbours(pos, nextDigit);
    for (const n of ns) {
      helper(n, nextDigit + 1, [...path, n], paths);
    }
  };

  const paths = [];
  helper(trailhead, 1, [trailhead], paths);

  if (wantUniqueDestinations) {
    const toRowColString = ({ row, col }) => `${row}:${col}`;
    return uniqueValuesBy(paths, (path) => toRowColString(last(path))).length;
  }

  return paths.length;
};

const part1 = async (filename) => {
  const grid = await parseFile(filename);
  const trailheads = findTrailheads(grid);
  const scores = trailheads.map((trailhead) => calculateScore(grid, trailhead, true));
  const total = sum(scores);
  console.log(total);
};

const part2 = async (filename) => {
  const grid = await parseFile(filename);
  const trailheads = findTrailheads(grid);
  const scores = trailheads.map((trailhead) => calculateScore(grid, trailhead, false));
  const total = sum(scores);
  console.log(total);
};

const main = async () => {
  await part1("day10/example.txt");
  await part1("day10/input.txt");

  await part2("day10/example.txt");
  await part2("day10/input.txt");
};

main();
