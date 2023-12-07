import { FileTypes, readFileToArray } from './util/read-puzzle.mts';

async function part1(lines: string[]) {}
async function part2(lines: string[]) {}

(async function () {
  const linesFromPuzzle = readFileToArray('<%day%>', FileTypes.sample2);
  await part1(linesFromPuzzle);

  const linesFromPuzzle2 = readFileToArray('<%day%>', FileTypes.sample2);
  await part2(linesFromPuzzle2);
})();
