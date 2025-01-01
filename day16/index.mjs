import { range, readGrid } from "../utils.mjs";
import { A_Star } from "../a-star.mjs";

const findThing = (grid, ch) => {
  const rows = grid.length;
  const cols = grid[0].length;

  for (const row of range(rows)) {
    for (const col of range(cols)) {
      if (grid[row][col] === ch) return { row, col };
    }
  }
};

const part1 = async (filename) => {
  const grid = await readGrid(filename);
  const start = findThing(grid, "S");
  const end = findThing(grid, "E");
  console.log({ start, end });

  const rows = grid.length;
  const cols = grid[0].length;

  const manhattanDistance = (a, b) => {
    const rowDiff = Math.abs(a.row - b.row);
    const colDiff = Math.abs(a.col - b.col);
    return rowDiff + colDiff;
  };

  const d = (n) => {
    return manhattanDistance(n, end);
  };

  const h = (n) => {
    return manhattanDistance(n, end);
  };

  const withinBounds = ({ row, col }) => {
    return row >= 0 && col >= 0 && row < rows && col < cols;
  };

  const findNeighbours = (n) => {
    const { row, col } = n;
    const ns = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];

    return ns
      .filter(withinBounds)
      .filter(({ row, col }) => grid[row][col] !== "#");
  };

  const path = A_Star(start, end, d, h, findNeighbours);
  console.log("path:", path);
};

const main = async () => {
  await part1("day16/example1.txt");
  // await part1("day16/example2.txt");
  // await part1("day16/input.txt");
};

main();
