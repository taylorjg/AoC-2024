import { groupBy, readGrid, uniqueValuesBy } from "../utils.mjs";

const checkBounds = (grid, p) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const isWithinBounds = p.row >= 0 && p.col >= 0 && p.row < rows && p.col < cols;
  return isWithinBounds ? p : undefined;
};

const handleLine = (grid) => (points) => {
  const [a, b] = points;
  const deltaRow = Math.abs(a.row - b.row);
  const deltaCol = Math.abs(a.col - b.col);
  const antinode1Row = a.row < b.row ? a.row - deltaRow : a.row + deltaRow;
  const antinode1Col = a.col < b.col ? a.col - deltaCol : a.col + deltaCol;
  const antinode2Row = a.row < b.row ? b.row + deltaRow : b.row - deltaRow;
  const antinode2Col = a.col < b.col ? b.col + deltaCol : b.col - deltaCol;
  const antinode1 = { row: antinode1Row, col: antinode1Col };
  const antinode2 = { row: antinode2Row, col: antinode2Col };
  return [
    checkBounds(grid, antinode1),
    checkBounds(grid, antinode2),
  ].filter(Boolean);
};

const handle2Lines = (grid, values) => {
  const [a, b] = values;
  return handleLine(grid)(a, b);
};

const handle3Lines = (grid, values) => {
  const [a, b, c] = values;
  return [
    [a, b],
    [b, c],
    [a, c],
  ].flatMap(handleLine(grid));
};

const handle4Lines = (grid, values) => {
  const [a, b, c, d] = values;
  return [
    [a, b],
    [a, c],
    [a, d],
    [b, c],
    [b, d],
    [c, d],
  ].flatMap(handleLine(grid));
};

const handleGroup = (grid) => (group) => {
  const [, values] = group;

  console.assert(values.length >= 2 && values.length <= 4);

  switch (values.length) {
    case 2: return handle2Lines(grid, values);
    case 3: return handle3Lines(grid, values);
    case 4: return handle4Lines(grid, values);
  }
};

const part1 = async (filename) => {
  const grid = await readGrid(filename);
  const xs = grid.flatMap((arr, row) => arr.map((f, col) => ({ row, col, f }))).filter(({ f }) => f !== ".");
  const groups = groupBy(xs, (x) => x.f);
  const antinodeLocations = Array.from(groups).flatMap(handleGroup(grid));
  const uniqueAntinodeLocations = uniqueValuesBy(antinodeLocations, ({ row, col }) => `${row}:${col}`);
  console.log(uniqueAntinodeLocations.length);
};

const main = async () => {
  await part1("day08/example.txt");
  await part1("day08/input.txt");
};

main();
