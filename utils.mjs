import { promises as fs } from "fs";

export const sum = (xs) => xs.reduce((acc, x) => acc + x, 0);
export const sumBy = (xs, fn) => xs.reduce((acc, x) => acc + fn(x), 0);

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
