import { range, sum, readGrid } from "../utils.mjs";
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

  const startNode = { ...start, dir: ">" };
  const endNode = { ...end, dir: "*" };

  const rows = grid.length;
  const cols = grid[0].length;

  const manhattanDistance = (a, b) => {
    const rowDiff = Math.abs(a.row - b.row);
    const colDiff = Math.abs(a.col - b.col);
    return rowDiff + colDiff;
  };

  const d = (n1, n2) => {
    return n1.dir === n2.dir ? 1 : 1000;
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
      { row: row - 1, col, dir: "^"},
      { row: row + 1, col, dir: "v" },
      { row, col: col - 1, dir: "<" },
      { row, col: col + 1, dir: ">" },
    ];

    return ns
      .filter(withinBounds)
      .filter(({ row, col }) => grid[row][col] !== "#");
  };

  const path = A_Star(startNode, endNode, d, h, findNeighbours);
  // console.log("path:", path);

  const scores = range(path.length - 1).map((index) => {
    const prevDir = path[index].dir;
    const nextDir = path[index + 1].dir;
    return prevDir === nextDir ? 1 : 1001;
  });
  const total = sum(scores);
  console.log(total);
};

const main = async () => {
  await part1("day16/example1.txt");
  await part1("day16/example2.txt");
  await part1("day16/input.txt");
};

main();
