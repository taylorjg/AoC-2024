import { range, readLines, sum } from "../utils.mjs";

const parseFile = async (filename) => {
  const lines = await readLines(filename);
  const rules = [];
  const updates = [];
  for (const line of lines) {
    if (line.includes("|")) {
      const bits = line.split("|");
      rules.push({
        x: Number(bits[0]),
        y: Number(bits[1])
      });
    } else {
      const numbers = line.split(",").map(Number);
      updates.push(numbers);
    }
  }
  return { rules, updates };
};

const checkLeftRule = (rule, update, xIndex) => {
  const yIndex = update.findIndex((n) => n === rule.y);
  return yIndex < 0 || xIndex < yIndex;
};

const checkRightRule = (rule, update, yIndex) => {
  const xIndex = update.findIndex((n) => n === rule.x);
  return xIndex < 0 || xIndex < yIndex;
};

const helper = (rules, update) => (index) => {
  const number = update[index];
  const leftRules = rules.filter((rule) => rule.x === number);
  const rightRules = rules.filter((rule) => rule.y === number);
  const leftRulesSatisfied = leftRules.every((rule) => checkLeftRule(rule, update, index));
  const rightRulesSatisfied = rightRules.every((rule) => checkRightRule(rule, update, index));
  return leftRulesSatisfied && rightRulesSatisfied;
};

const isUpdateCorrectlyOrdered = (rules) => (update) => {
  const indices = update.length;
  return range(indices).every(helper(rules, update));
};

const getMiddleNumber = (xs) => xs[(xs.length - 1) / 2];

const part1 = async (filename) => {
  const { rules, updates } = await parseFile(filename);
  const correctlyOrderedUpdates = updates.filter(isUpdateCorrectlyOrdered(rules));
  const middleNumbers = correctlyOrderedUpdates.map(getMiddleNumber);
  const total = sum(middleNumbers);
  console.log(total);
};

const reorderUpdate = (rules) => (update) => {
  const compareFn = (a, b) => {
    const applicableRule = rules.find(({ x, y }) => (x === a && y === b) || (x === b && y === a));
    return applicableRule.x === a ? -1 : +1;
  };

  return update.sort(compareFn);
};

const part2 = async (filename) => {
  const { rules, updates } = await parseFile(filename);
  const incorrectlyOrderedUpdates = updates.filter((update) => !isUpdateCorrectlyOrdered(rules)(update));
  const correctlyOrderedUpdates = incorrectlyOrderedUpdates.map(reorderUpdate(rules));
  const middleNumbers = correctlyOrderedUpdates.map(getMiddleNumber);
  const total = sum(middleNumbers);
  console.log(total);
};

const main = async () => {
  await part1("day05/example.txt");
  await part1("day05/input.txt");

  await part2("day05/example.txt");
  await part2("day05/input.txt");
};

main();
