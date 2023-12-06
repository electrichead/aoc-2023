import { zip } from 'lodash';
import { FileTypes, readFileToArray } from './util/read-puzzle';

function parseLines(lines: string[]) {
  const time = lines[0]
    .replace(/Time:\s+/, '')
    .split(/\s+/)
    .map((t) => +t);

  const distance = lines[1]
    .replace(/Distance:\s+/, '')
    .split(/\s+/)
    .map((t) => +t);

  return zip(time, distance);
}

function quadratic(k: number, r: number) {
  const rem = Math.sqrt(k * k - 4 * r);
  const first = Math.floor((k - rem) / 2) + 1;
  const second = Math.ceil((k + rem) / 2) - 1; //?
  return [first, second];
}

function getResults(data: [k: number, r: number][]) {
  return data
    .map(([k, r]) => quadratic(k, r))
    .reduce((memo, [a, b]) => memo * (b - a + 1), 1);
}

async function part1(lines: string[]) {
  console.log(getResults(parseLines(lines)));
}
async function part2(lines: string[]) {
  const time = +lines[0].replace(/Time:\s+/, '').replace(/\s*/g, '');

  const distance = +lines[1].replace(/Distance:\s+/, '').replace(/\s*/g, '');

  console.log(getResults([[time, distance]]));
}

(async function () {
  const linesFromPuzzle = readFileToArray('06', FileTypes.sample2);
  await part1(linesFromPuzzle);

  const linesFromPuzzle2 = readFileToArray('06', FileTypes.sample2);
  await part2(linesFromPuzzle2);
})();
