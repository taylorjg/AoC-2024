import { last, partition, range, readLines, sum } from "../utils.mjs";

const parseFile = async (filename) => {
  const lines = await readLines(filename);
  const [movesLines, gridLines] = partition(lines, (line) => line.includes("^"));
  const grid = gridLines.map((line) => Array.from(line));
  const moves = movesLines.join("");
  return { grid, moves };
};

const findThing = (grid, ch) => {
  const rows = grid.length;
  const cols = grid[0].length;

  for (const row of range(rows)) {
    for (const col of range(cols)) {
      if (grid[row][col] === ch) return { row, col };
    }
  }
};

const findThings = (grid, ch) => {
  const rows = grid.length;
  const cols = grid[0].length;

  const things = [];

  for (const row of range(rows)) {
    for (const col of range(cols)) {
      if (grid[row][col] === ch) {
        things.push({ row, col });
      };
    }
  }

  return things;
};

const advance = (pos, dir) => {
  const { row, col } = pos;

  switch (dir) {
    case "^": return { row: row - 1, col };
    case "v": return { row: row + 1, col };
    case "<": return { row, col: col - 1 };
    case ">": return { row, col: col + 1 };
  }
};

const sameLocation = (a, b) => a.row === b.row && a.col === b.col;

const findBoxesInGivenDirection = (grid, pos, dir, boxes) => {
  const boxesFound = [];
  let curr = pos;

  for (; ;) {
    curr = advance(curr, dir);
    if (grid[curr.row][curr.col] === "#") break;

    const boxesAtCurr = boxes.filter((box) => sameLocation(box, curr));
    console.assert(boxesAtCurr.length === 0 || boxesAtCurr.length === 1);
    if (boxesAtCurr.length === 0) break;
    boxesFound.push(boxesAtCurr[0]);
  }

  return boxesFound;
};

const findNearestWall = (grid, pos, dir) => {
  let curr = pos;
  for (; ;) {
    if (grid[curr.row][curr.col] === "#") return curr;
    curr = advance(curr, dir);
  }
};

const makeMove = (grid, robot, boxes, dir) => {
  const newPos = advance(robot, dir);
  const boxesFound = findBoxesInGivenDirection(grid, robot, dir, boxes);
  const wall = findNearestWall(grid, robot, dir);

  // Wall there => can't move
  if (sameLocation(newPos, wall)) return;

  // No box there => can move
  const firstBox = boxesFound[0];
  if (!firstBox || !sameLocation(firstBox, newPos)) {
    robot.row = newPos.row;
    robot.col = newPos.col;
    return;
  }

  // We have one or more boxes to move

  const lastBox = last(boxesFound);
  const afterLastBox = advance(lastBox, dir);

  // Wall there => can't move
  if (sameLocation(afterLastBox, wall)) return;

  // Shuffle the boxes along by 1
  for (const box of boxesFound) {
    const newBoxPos = advance(box, dir);
    box.row = newBoxPos.row;
    box.col = newBoxPos.col;
  }

  // Robot can now occupy newPos
  robot.row = newPos.row;
  robot.col = newPos.col;
};

const makeGpsValue = (pos) => {
  const { row, col } = pos;
  return 100 * row + col;
};

const part1 = async (filename) => {
  const { grid, moves } = await parseFile(filename);
  const robot = findThing(grid, "@");
  const boxes = findThings(grid, "O");

  for (const move of moves) {
    makeMove(grid, robot, boxes, move);
  }

  const gpsValues = boxes.map(makeGpsValue);
  const total = sum(gpsValues);
  console.log(total);
};

const main = async () => {
  await part1("day15/example-small.txt");
  await part1("day15/example.txt");
  await part1("day15/input.txt");
};

main();
