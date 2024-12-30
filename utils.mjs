import { promises as fs } from "fs";

export const sum = (xs) => xs.reduce((acc, x) => acc + x, 0);
export const sumBy = (xs, fn) => xs.reduce((acc, x) => acc + fn(x), 0);

export const uniqueValues = (xs) => Array.from(new Set(xs));
export const uniqueValuesBy = (xs, fn) => Array.from(new Set(xs.map(fn)));

export const groupBy = (xs, fn) => {
  const kvps = xs.map((x) => [fn(x), x]);
  const m = new Map();
  
  for (const [k, v] of kvps) {
    m.has(k) ? m.get(k).push(v) : m.set(k, [v]);
  }

  return m;
};

export const isEven = (n) => n % 2 === 0;

export const range = (n) => Array.from(Array(n).keys());

export const partition = (xs, p) => {
  const xsPassing = [];
  const xsFailing = [];

  for (const x of xs) {
    const arr = p(x) ? xsPassing : xsFailing;
    arr.push(x);
  }

  return [xsPassing, xsFailing];
};

export const readLines = async (filename) => {
  const content = await fs.readFile(filename, "utf-8");
  const lines = content.split("\n").filter(Boolean);
  return lines;
};

export const readGrid = async (filename) => {
  const lines = await readLines(filename);
  return lines.map((line) => Array.from(line));
};
