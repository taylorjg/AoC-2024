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
          workingRegions = [mergedRegion, ...otherRegions];
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

const diffsBy = (xs, fn) => range(xs.length - 1).map((index) => fn(xs[index + 1]) - fn(xs[index]));

const countConsecutiveLines = (xs, compareFn, groupByFn, diffByFn) => {
  const sorted = xs.slice().sort(compareFn);
  const grouped = groupBy(sorted, groupByFn);
  const lists = Array.from(grouped.values());
  const diffs = lists.flatMap((list) => diffsBy(list, diffByFn));
  return diffs.filter((diff) => diff === 1).length;
};

const countConsecutiveHorizontalLines = (xs) => {
  const compareFn = (a, b) => {
    return a.row === b.row ? a.col - b.col : a.row - b.row;
  };

  const groupByFn = (x) => `${x.row}:${x.dir}`;
  const diffByFn = (x) => x.col;

  return countConsecutiveLines(xs, compareFn, groupByFn, diffByFn);
};

const countConsecutiveVerticalLines = (xs) => {
  const compareFn = (a, b) => {
    return a.col === b.col ? a.row - b.row : a.col - b.col;
  };

  const groupByFn = (x) => `${x.col}:${x.dir}`;
  const diffByFn = (x) => x.row;

  return countConsecutiveLines(xs, compareFn, groupByFn, diffByFn);
};

const calculatePerimeter2 = (region) => {
  const rows = region.length;
  const cols = region[0].length;

  const xs = [];

  for (const row of range(rows)) {
    for (const col of range(cols)) {
      if (region[row][col] === ".") continue;
      const ns = [
        { row: row - 1, col, dir: 0 }, // dir is facing up
        { row: row + 1, col, dir: 1 }, // dir is facing down
        { row, col: col - 1, dir: 2 }, // dir is facing left
        { row, col: col + 1, dir: 3 }, // dir is facing right
      ].filter(({ row, col }) => {
        const ch = region[row]?.[col] ?? ".";
        return ch === ".";
      });
      xs.push(...ns);
    }
  }

  const a = countConsecutiveHorizontalLines(xs);
  const b = countConsecutiveVerticalLines(xs);

  return xs.length - a - b;
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

const calculatePrice = (region, part2Mode) => {
  const regionGrid = makeRegionGrid(region);
  const area = calculateArea(regionGrid);
  const perimeter = part2Mode
    ? calculatePerimeter2(regionGrid)
    : calculatePerimeter(regionGrid);
  console.log({ plant: region.plant, area, perimeter, price: area * perimeter });
  return area * perimeter;
};

const part1 = async (filename) => {
  const grid = await readGrid(filename);
  const regions = findRegions(grid);
  const mergedRegions = mergeRegions(regions);
  const prices = mergedRegions.map((region) => calculatePrice(region, false));
  const total = sum(prices);
  console.log(total);
};

const part2 = async (filename) => {
  const grid = await readGrid(filename);
  const regions = findRegions(grid);
  const mergedRegions = mergeRegions(regions);
  const prices = mergedRegions.map((region) => calculatePrice(region, true));
  const total = sum(prices);
  console.log(total);
};

const main = async () => {
  await part1("day12/example.txt");
  await part1("day12/input.txt");

  await part2("day12/part2-a.txt");
  await part2("day12/part2-b.txt");
  await part2("day12/part2-c.txt");
  await part2("day12/part2-d.txt");
  await part2("day12/example.txt");
  await part2("day12/input.txt");
};

main();
