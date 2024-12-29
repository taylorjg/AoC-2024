import { readLines, range, sumBy } from "../utils.mjs";

const parseFile = async (filename) => {
  const lines = await readLines(filename);
  return lines.map((line) => {
    const bits = line.split(":").map(s => s.trim());
    const testValue = Number(bits[0]);
    const numbers = bits[1].split(/\s/).map(Number);
    return { testValue, numbers };
  });
};

const makeListsOfOperators = (operatorChars, n) => {
  const ys = Array.from(operatorChars);

  const helper = (xs, n) =>
    n === 0
      ? xs
      : helper(xs.length === 0 ? ys : xs.flatMap(x => ys.map(y => x + y)), n - 1);

  return helper([], n);
};

const add = (a, b) => a + b;
const mul = (a, b) => a * b;
const concatenation = (a, b) => Number(`${a}${b}`);

const lookupOperator = (ch) => {
  switch (ch) {
    case "+": return add;
    case "*": return mul;
    case "&": return concatenation;
  }
};

const evaluateListOfOperators = (numbers, operators) => {
  const callbackFn = (acc, index) => {
    const operator = lookupOperator(operators[index]);
    const operand1 = acc;
    const operand2 = numbers[index + 1];
    return operator(operand1, operand2);
  };

  const seed = numbers[0];

  return range(operators.length).reduce(callbackFn, seed);
};

const hasSolution = (operatorChars) => (equation) => {
  const { testValue, numbers } = equation;
  const operatorCount = numbers.length - 1;
  const listsOfOperators = makeListsOfOperators(operatorChars, operatorCount);
  for (const listOfOperators of listsOfOperators) {
    const result = evaluateListOfOperators(numbers, listOfOperators);
    if (result === testValue) return true;
  }
  return false;
};

const part1 = async (filename) => {
  const equations = await parseFile(filename);
  const goodEquations = equations.filter(hasSolution("+*"));
  const total = sumBy(goodEquations, (x) => x.testValue);
  console.log(total);
};

const part2 = async (filename) => {
  const equations = await parseFile(filename);
  const goodEquations = equations.filter(hasSolution("+*&"));
  const total = sumBy(goodEquations, (x) => x.testValue);
  console.log(total);
};

const main = async () => {
  await part1("day07/example.txt");
  await part1("day07/input.txt");

  await part2("day07/example.txt");
  await part2("day07/input.txt");
};

main();
