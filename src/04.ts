import { from, map, scan } from 'rxjs';
import { FileTypes, readFileToArray } from './util/read-puzzle';

// const lines = readFileToArray('04', FileTypes.sample);
const lines = readFileToArray('04', FileTypes.sample2);

enum NumOrCount {
  'num' = 'num',
  'count' = 'count',
}

function processLine(str: string, numOrCount: NumOrCount) {
  const regex = /Card\s*(?<num>\d+): (?<game>.+)/;

  const res = str.match(regex);
  const [winners, actual] = res?.groups?.game.split(' | ') || [,];

  const winnerMap = winners
    ?.split(/\s+/)
    .map((n) => +n)
    .reduce((memo, val) => ({ ...memo, [val]: true }), {});

  const numMatches = actual
    ?.split(/\s+/)
    .reduce((memo, val) => (winnerMap[+val] === true ? memo + 1 : memo), 0);

  return numMatches > 0
    ? numOrCount === NumOrCount.num
      ? Math.pow(2, numMatches - 1)
      : numMatches
    : 0;
}
function part1() {
  from(lines)
    .pipe(
      map((l) => {
        return processLine(l, NumOrCount.num);
      }),
      scan((memo, val) => memo + val, 0)
    )
    .subscribe({
      next: (r) => console.log(r),
      error: (err) => console.error(err),
      complete: () => console.log('Done.'),
    });
}

function part2() {
  const numGames = lines.length;
  const winsForGame = lines.map((l) => processLine(l, NumOrCount.count));
  const winMap: { [key: number]: number } = {};

  for (let i = numGames - 1; i >= 0; i--) {
    const numWins = winsForGame[i];
    console.log({ i, numWins, line: lines[i] });

    if (numWins === 0) {
      winMap[i] = 0;
      continue;
    }

    let descendentWins = 0;

    for (let j = i + 1; j < i + numWins + 1 && j < numGames - 1; j++) {
      descendentWins += winMap[j];
    }

    winMap[i] = descendentWins + numWins;
  }
  const totalWins = Object.values(winMap).reduce((memo, val) => memo + val, 0);

  console.log(winMap);
  console.log(totalWins + numGames);
}

// part1();
part2();
