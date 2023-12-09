import { pairwise } from './util/pairwise.mts';
import { FileTypes, readFileToArray } from './util/read-puzzle.mts';

function expandRow(row: number[]) {
  let arr: number[][] = [row];
  let allZeros = false;
  let count = 0;

  while (!allZeros && count++ < 10_000) {
    const nextRow = pairwise(arr[arr.length - 1]).map(([a, b]) => b - a);
    arr.push(nextRow);
    allZeros = arr[arr.length - 1].every((a) => a === 0);
  }

  if (count == 10_000) {
    throw new Error('over 10,000 rows');
  }

  return arr;
}

function processRow(
  row: number[],
  iterator: (a: number[], b: number) => number
) {
  const expandedRow = expandRow(row);
  let nextVal = 0;

  for (let i = expandedRow.length - 1; i >= 0; i--) {
    nextVal = iterator(expandedRow[i], nextVal);
  }

  return nextVal;
}

async function part1(lines: string[]) {
  const res = lines.map((l) =>
    processRow(
      l.split(' ').map((s) => +s),
      (row, prev) => row.at(-1) + prev
    )
  );

  console.log(res.reduce((memo, val) => memo + val, 0));
}
async function part2(lines: string[]) {
  const res = lines.map((l) =>
    processRow(
      l.split(' ').map((s) => +s),
      (row, prev) => row.at(0) - prev
    )
  );

  console.log(res.reduce((memo, val) => memo + val, 0));
}

(async function () {
  // const linesFromPuzzle = readFileToArray('09', FileTypes.sample);
  // const linesFromPuzzle = readFileToArray('09', FileTypes.sample2);
  // await part1(linesFromPuzzle);

  const linesFromPuzzle2 = readFileToArray('09', FileTypes.sample2);
  await part2(linesFromPuzzle2);
})();
