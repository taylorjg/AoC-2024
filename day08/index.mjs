import { groupBy, readGrid, uniqueValuesBy } from "../utils.mjs";

const checkBounds = (grid, p) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const isWithinBounds = p.row >= 0 && p.col >= 0 && p.row < rows && p.col < cols;
  return isWithinBounds ? p : undefined;
};

const getNextAntinode1 = (grid, a, b, deltaRow, deltaCol, n) => {
  const row = a.row < b.row ? a.row - n * deltaRow : a.row + n * deltaRow;
  const col = a.col < b.col ? a.col - n * deltaCol : a.col + n * deltaCol;
  return checkBounds(grid, { row, col });
};

const getNextAntinode2 = (grid, a, b, deltaRow, deltaCol, n) => {
  const row = a.row < b.row ? b.row + n * deltaRow : b.row - n * deltaRow;
  const col = a.col < b.col ? b.col + n * deltaCol : b.col - n * deltaCol;
  return checkBounds(grid, { row, col });
};

const getAntinodes1 = (grid, a, b, deltaRow, deltaCol) => {
  const antinodes = [];
  let n = 1;
  for (; ;) {
    const antinode = getNextAntinode1(grid, a, b, deltaRow, deltaCol, n++);
    if (!antinode) break;
    antinodes.push(antinode);
  }
  return antinodes;
};

const getAntinodes2 = (grid, a, b, deltaRow, deltaCol) => {
  const antinodes = [];
  let n = 1;
  for (; ;) {
    const antinode = getNextAntinode2(grid, a, b, deltaRow, deltaCol, n++);
    if (!antinode) break;
    antinodes.push(antinode);
  }
  return antinodes;
};

const handleLine = (grid, inPart2Mode) => (points) => {
  const [a, b] = points;
  const deltaRow = Math.abs(a.row - b.row);
  const deltaCol = Math.abs(a.col - b.col);

  if (inPart2Mode) {
    const antinodes1 = getAntinodes1(grid, a, b, deltaRow, deltaCol);
    const antinodes2 = getAntinodes2(grid, a, b, deltaRow, deltaCol);
    return [...antinodes1, ...antinodes2];
  }

  const antinode1 = getNextAntinode1(grid, a, b, deltaRow, deltaCol, 1);
  const antinode2 = getNextAntinode2(grid, a, b, deltaRow, deltaCol, 1);
  return [antinode1, antinode2].filter(Boolean);
};

const handleGroup = (grid, inPart2Mode) => (group) => {
  const [, values] = group;

  console.assert(values.length >= 2 && values.length <= 4);

  const handle2Lines = (values) => {
    return [values].flatMap(handleLine(grid, inPart2Mode));
  };

  const handle3Lines = (values) => {
    const [a, b, c] = values;
    return [
      [a, b],
      [b, c],
      [a, c],
    ].flatMap(handleLine(grid, inPart2Mode));
  };

  const handle4Lines = (values) => {
    const [a, b, c, d] = values;
    return [
      [a, b],
      [a, c],
      [a, d],
      [b, c],
      [b, d],
      [c, d],
    ].flatMap(handleLine(grid, inPart2Mode));
  };

  switch (values.length) {
    case 2: return handle2Lines(values);
    case 3: return handle3Lines(values);
    case 4: return handle4Lines(values);
  }
};

const part1 = async (filename) => {
  const grid = await readGrid(filename);
  const xs = grid.flatMap((arr, row) => arr.map((f, col) => ({ row, col, f }))).filter(({ f }) => f !== ".");
  const groups = groupBy(xs, (x) => x.f);
  const antinodeLocations = Array.from(groups).flatMap(handleGroup(grid, false));
  const uniqueAntinodeLocations = uniqueValuesBy(antinodeLocations, ({ row, col }) => `${row}:${col}`);
  console.log(uniqueAntinodeLocations.length);
};

const part2 = async (filename) => {
  const grid = await readGrid(filename);
  const xs = grid.flatMap((arr, row) => arr.map((f, col) => ({ row, col, f }))).filter(({ f }) => f !== ".");
  const groups = groupBy(xs, (x) => x.f);
  const antinodeLocations = Array.from(groups).flatMap(handleGroup(grid, true)).concat(xs);
  const uniqueAntinodeLocations = uniqueValuesBy(antinodeLocations, ({ row, col }) => `${row}:${col}`);
  console.log(uniqueAntinodeLocations.length);
};

const main = async () => {
  await part1("day08/example.txt");
  await part1("day08/input.txt");

  await part2("day08/example.txt");
  await part2("day08/input.txt");
};

main();
