import {
  concatMap,
  filter,
  from,
  last,
  map,
  pairwise,
  startWith,
  toArray,
} from 'rxjs';
import { FileTypes, readFileToArray } from './util/read-puzzle.mts';
import lodash from 'lodash';

function getTheMap(lines: string[]) {
  return lines.reduce<{
    [key: string]: { key: string; left: string; right: string };
  }>((memo, val) => {
    const parsed =
      /(?<key>[0-9A-Z]+) = \((?<left>[0-9A-Z]+), (?<right>[0-9A-Z]+)\)/.exec(
        val
      );

    if (!parsed || !parsed.groups) {
      console.log({ val, parsed });
      throw new Error('Error parsing input');
    }

    memo[parsed.groups['key']] = {
      key: parsed.groups['key'],
      left: parsed.groups['left'],
      right: parsed.groups['right'],
    };

    return memo;
  }, {});
}

async function part1(lines: string[]) {
  const dirs = lines[0].split('');
  const theMap = getTheMap(lines.slice(2));

  let res = theMap['AAA'];
  let counter = 1;

  while (res.key !== 'ZZZ') {
    for (let i = 0; i < dirs.length; i++, counter++) {
      res = theMap[dirs[i] === 'R' ? res.right : res.left];
      if (res.key === 'ZZZ') {
        console.log('found');
        break;
      }
    }
  }

  console.log(counter);
}
function solve(arr) {
  const [first, ...rest] = arr;
  const i = 0;
  while (i < 10000) {
    if (
      rest.every(
        (r) => (first.start + first.count * i - r.start) % r.count === 0
      )
    ) {
      break;
    }
  }

  console.log(i);

  return i;
}
async function part2(lines: string[]) {
  const dirs = lines[0].split('');
  const theMap = getTheMap(lines.slice(2));

  let res = Object.keys(theMap)
    .filter((t) => t.endsWith('A'))
    .map((t) => theMap[t]);

  console.log('Number of parallelPaths', res.length);
  let counter = 0;
  let j = 0;

  const parallelPaths = new Array(res.length).fill(1).map(() => []);

  while (j < 30_000 && res.some((r) => !r.key.endsWith('Z'))) {
    for (let i = 0; i < dirs.length; i++, counter++) {
      res = res.map((r) => theMap[dirs[i] === 'R' ? r.right : r.left]);

      if (res.some((r) => r.key.endsWith('Z'))) {
        res.forEach((r, thread) => {
          if (r.key.endsWith('Z')) {
            parallelPaths[thread].push(i * j);
          }
        });
      }

      if (res.every((r) => r.key.endsWith('Z'))) {
        console.log('found');
        break;
      }
    }
    j++;
  }

  console.log(counter); // 0-based

  from(parallelPaths)
    .pipe(
      map((path) => {
        const [first, ...rest] = path;

        return rest.reduce(
          (memo, val) => {
            const diff = val - memo.last;
            if (!memo.index[diff]) {
              memo.index[diff] = true;
            }
            memo.last = val;
            return memo;
          },
          {
            index: {},
            last: first,
            first,
          }
        );
      }),
      toArray(),
      last()
    )
    .subscribe({
      next: (val) => {
        console.log('val', solve(val));
      },
      error: (err) => console.error(err),
      complete: () => console.log('complete'),
    });
}

(async function () {
  // const linesFromPuzzle = readFileToArray('08', FileTypes.sample);
  // const linesFromPuzzle = readFileToArray('08', FileTypes.sample2);
  // await part1(linesFromPuzzle);

  // const linesFromPuzzle2 = readFileToArray('08', FileTypes.sample);
  const linesFromPuzzle2 = readFileToArray('08', FileTypes.sample2);
  await part2(linesFromPuzzle2);
})();

/* 
  Part 1 was fine - did it after midnight. Part 2 nive attempt took too long and hung.
  The morning after, decided to output when any of the paths were hit and it looked pretty
  but didn't see any immediate pattern.
  
  Going to try creating a function that identifies repeated cycles from one Z hit to another
  for each parallel path.
  
  why is Array creation like this always a footgun? filled it with the same [] reference and
  struggled for a bit
  
  Aha! outputing the distance of each path from one Z to another results in identical numbers
  for each path. So I guess it's a math question for when these will converge given starting number
  and recurrence of each path.
  
  Not sure why this wasn't a given to me; I mean from one Z to the next
  won't it intuitively always be the same? I guess not, I mean you might have multiple Zs on a path.
 */
