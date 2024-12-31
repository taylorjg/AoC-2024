import { range, readLines } from "../utils.mjs";

const parseFile = async (filename) => {
  const lines = await readLines(filename);
  const robots = [];

  for (const line of lines) {
    const m = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/);
    const px = Number(m[1]);
    const py = Number(m[2]);
    const vx = Number(m[3]);
    const vy = Number(m[4]);
    robots.push({ p: { x: px, y: py }, v: { x: vx, y: vy } });
  }

  return robots;
};

const moveRobotOneStep = (robot, width, height) => {
  let px = robot.p.x + robot.v.x;
  let py = robot.p.y + robot.v.y;
  if (px >= width) px = px % width;
  if (py >= height) py = py % height;
  if (px < 0) px = width + px;
  if (py < 0) py = height + py;
  robot.p.x = px;
  robot.p.y = py;
};

const moveRobots = (robots, width, height, count) => {
  for (const _ of range(count)) {
    for (const robot of robots) {
      moveRobotOneStep(robot, width, height);
    }
  }
};

const getDims = (width, height, quadrant) => {
  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);

  // 0|1
  // 2|3
  switch (quadrant) {
    case 0: return { minX: 0, maxX: midX - 1, minY: 0, maxY: midY - 1 };
    case 1: return { minX: midX + 1, maxX: width - 1, minY: 0, maxY: midY - 1 };
    case 2: return { minX: 0, maxX: midX - 1, minY: midY + 1, maxY: height - 1 };
    case 3: return { minX: midX + 1, maxX: width - 1, minY: midY + 1, maxY: height - 1 };
  }
};

const countRobotsInQuadrant = (robots, width, height, quadrant) => {
  const { minX, maxX, minY, maxY } = getDims(width, height, quadrant);
  const robotsInQuadrant = robots.filter((robot) => {
    const x = robot.p.x;
    const y = robot.p.y;
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  });
  return robotsInQuadrant.length;
};

const part1 = async (filename, width, height) => {
  const robots = await parseFile(filename);
  moveRobots(robots, width, height, 100);
  const count1 = countRobotsInQuadrant(robots, width, height, 0);
  const count2 = countRobotsInQuadrant(robots, width, height, 1);
  const count3 = countRobotsInQuadrant(robots, width, height, 2);
  const count4 = countRobotsInQuadrant(robots, width, height, 3);
  const total = count1 * count2 * count3 * count4;
  console.log(total);
};

const main = async () => {
  await part1("day14/example.txt", 11, 7);
  await part1("day14/input.txt", 101, 103);
};

main();
