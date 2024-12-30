import { range, readGrid, sum } from "../utils.mjs";

const findRegions = (grid) => {
  const rows = grid.length;
  const cols = grid[0].length;

  const regions = [];

  const sameLocation = (a, b) => a.row === b.row && a.col === b.col;

  const findExistingRegion = (row, col, ch) => {
    const ns = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];

    for (const r of regions) {
      if (r.ch === ch) {
        if (r.locations.some((l) => ns.some((n) => sameLocation(l, n)))) return r;
      }
    }

    return false;
  };

  for (const row of range(rows)) {
    for (const col of range(cols)) {
      const ch = grid[row][col];
      const existingRegion = findExistingRegion(row, col, ch);
      const location = { row, col };
      if (existingRegion) {
        existingRegion.locations.push(location);
      } else {
        regions.push({ ch, locations: [location] });
      }
    }
  }

  return regions;
};

const calculateArea = (region) => {
  const rows = region.length;
  const cols = region[0].length;
  let area = 0;

  for (const row of range(rows)) {
    for (const col of range(cols)) {
      if (region[row][col] !== ".") area++;
    }
  }

  return area;
};

const calculatePerimeter = (region) => {
  const rows = region.length;
  const cols = region[0].length;
  let perimeter = 0;

  for (const row of range(rows)) {
    for (const col of range(cols)) {
      if (region[row][col] === ".") continue;
      const es = [
        region[row - 1]?.[col],
        region[row + 1]?.[col],
        region[row]?.[col - 1],
        region[row]?.[col + 1],
      ].filter((ch) => ch === undefined || ch === ".");
      perimeter += es.length;
    }
  }

  return perimeter;
};

const makeRegionGrid = (region) => {
  const allRowValues = region.locations.map(({ row }) => row);
  const allColValues = region.locations.map(({ col }) => col);
  const minRow = Math.min(...allRowValues);
  const maxRow = Math.max(...allRowValues);
  const minCol = Math.min(...allColValues);
  const maxCol = Math.max(...allColValues);
  const rows = maxRow - minRow + 1;
  const cols = maxCol - minCol + 1;

  const regionGrid = range(rows).map((_) => Array.from(".".repeat(cols)));

  for (const { row, col } of region.locations) {
    const relativeRow = row - minRow;
    const relativeCol = col - minCol;
    regionGrid[relativeRow][relativeCol] = region.ch;
  }

  return regionGrid;
};

const calculatePrice = (region) => {
  const regionGrid = makeRegionGrid(region);
  const area = calculateArea(regionGrid);
  const perimeter = calculatePerimeter(regionGrid);
  console.log({ ch: region.ch, area, perimeter, price: area * perimeter });
  return area * perimeter;
};

const part1 = async (filename) => {
  const grid = await readGrid(filename);
  const regions = findRegions(grid);
  console.dir(regions, { depth: null });
  const prices = regions.map(calculatePrice);
  console.log(prices);
  const total = sum(prices);
  console.log(total);
};

const main = async () => {
  await part1("day12/example.txt");
  // await part1("day12/input.txt"); // 26 plants A-Z
};

main();
