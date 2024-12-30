import { groupBy, range, readGrid, sum } from "../utils.mjs";

const sameLocation = (a, b) => a.row === b.row && a.col === b.col;

const findRegions = (grid) => {
  const rows = grid.length;
  const cols = grid[0].length;

  const regions = [];

  const findExistingRegion = (row, col, plant) => {
    const ns = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];

    for (const r of regions) {
      if (r.plant === plant) {
        if (r.locations.some((l) => ns.some((n) => sameLocation(l, n)))) return r;
      }
    }

    return false;
  };

  for (const row of range(rows)) {
    for (const col of range(cols)) {
      const plant = grid[row][col];
      const existingRegion = findExistingRegion(row, col, plant);
      const location = { row, col };
      if (existingRegion) {
        existingRegion.locations.push(location);
      } else {
        regions.push({ plant, locations: [location] });
      }
    }
  }

  return regions;
};

const shouldBeSingleRegion = (r1, r2) => {
  for (const l1 of r1.locations) {
    const { row, col } = l1;
    const ns = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];
    if (r2.locations.some((l2) => ns.some(n => sameLocation(n, l2)))) {
      return true;
    }
  }
  return false;
};

const mergeGroupOfRegions = (groupOfRegions) => {
  let workingRegions = groupOfRegions;

  for (; ;) {
    let somethingMerged = false;

    for (const r1 of workingRegions) {
      if (somethingMerged) break;

      for (const r2 of workingRegions) {
        if (somethingMerged) break;

        if (r1 === r2) continue;

        if (shouldBeSingleRegion(r1, r2)) {
          const mergedRegion = { plant: r1.plant, locations: r1.locations.concat(r2.locations) };
          const otherRegions = workingRegions.filter((r) => r !== r1 && r !== r2);
          workingRegions =[mergedRegion, ...otherRegions];
          somethingMerged = true;
        }
      }
    }

    if (!somethingMerged) break;
  }

  return workingRegions;
};

const mergeRegions = (regions) => {
  const groupedByPlant = groupBy(regions, (region) => region.plant);
  const mergedRegions = Array.from(groupedByPlant).flatMap(([, v]) => mergeGroupOfRegions(v));
  return mergedRegions;
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
    regionGrid[relativeRow][relativeCol] = region.plant;
  }

  return regionGrid;
};

const calculatePrice = (region) => {
  const regionGrid = makeRegionGrid(region);
  const area = calculateArea(regionGrid);
  const perimeter = calculatePerimeter(regionGrid);
  console.log({ plant: region.plant, area, perimeter, price: area * perimeter });
  return area * perimeter;
};

const part1 = async (filename) => {
  const grid = await readGrid(filename);
  const regions = findRegions(grid);
  const mergedRegions = mergeRegions(regions);
  const prices = mergedRegions.map(calculatePrice);
  const total = sum(prices);
  console.log(total);
};

const main = async () => {
  await part1("day12/example.txt");
  await part1("day12/input.txt");
};

main();
