import { FileTypes, readFileToArray } from './util/read-puzzle';

type Cell = {
  val: string;
  num: boolean;
  special: boolean;
  dot: boolean;
};

const grid = readFileToArray('03', FileTypes.sample2).map((l) =>
  l.split('').map((cell) => {
    const digit = /[0-9]/.test(cell);
    return {
      val: cell,
      num: digit,
      special: !digit && cell !== '.',
      dot: cell === '.',
    };
  })
);

const numLines = grid.length;
let sum = 0;
let isPartOfNum = false;
let foundNearbySymbol: null | { val: string; pos: string }[] = null;
let num = '';

const res = [];
const gearMap: { [key: string]: Set<number> } = {};

for (let row = 0; row < numLines; row++) {
  // console.log('');

  if (isPartOfNum) {
    console.log(num, foundNearbySymbol);
    if (foundNearbySymbol !== null) {
      sum += +num;

      const foundGears = [
        ...new Set(
          foundNearbySymbol.filter((s) => s.val === '*').map((s) => s.pos)
        ),
      ];

      if (foundGears.length > 0) {
        res.push({
          num: +num,
          gears: foundGears,
        });

        foundGears.forEach((gear) => {
          if (!gearMap[gear]) {
            gearMap[gear] = new Set<number>();
          }
          gearMap[gear].add(+num);
        });
      }

      foundNearbySymbol = null;
    }

    isPartOfNum = false;
    num = '';
  } else {
    foundNearbySymbol = null;
    num = '';
  }

  for (let col = 0; col < grid[0].length; col++) {
    const curr = grid[row][col];

    if (curr.num) {
      isPartOfNum = true;
      num += curr.val;

      // if (foundNearbySymbol !== null) {
      //   continue;
      // }

      // test nearby

      if (grid[row - 1]?.[col - 1]?.special) {
        if (foundNearbySymbol === null) {
          foundNearbySymbol = [];
        }
        foundNearbySymbol.push({
          val: grid[row - 1]?.[col - 1]?.val,
          pos: `${row - 1}, ${col - 1}`,
        });
      }
      if (grid[row - 1]?.[col]?.special) {
        if (foundNearbySymbol === null) {
          foundNearbySymbol = [];
        }
        foundNearbySymbol.push({
          val: grid[row - 1]?.[col]?.val,
          pos: `${row - 1}, ${col}`,
        });
      }
      if (grid[row - 1]?.[col + 1]?.special) {
        if (foundNearbySymbol === null) {
          foundNearbySymbol = [];
        }
        foundNearbySymbol.push({
          val: grid[row - 1]?.[col + 1]?.val,
          pos: `${row - 1}, ${col + 1}`,
        });
      }
      if (grid[row]?.[col - 1]?.special) {
        if (foundNearbySymbol === null) {
          foundNearbySymbol = [];
        }
        foundNearbySymbol.push({
          val: grid[row]?.[col - 1]?.val,
          pos: `${row}, ${col - 1}`,
        });
      }
      if (grid[row]?.[col + 1]?.special) {
        if (foundNearbySymbol === null) {
          foundNearbySymbol = [];
        }
        foundNearbySymbol.push({
          val: grid[row]?.[col + 1]?.val,
          pos: `${row}, ${col + 1}`,
        });
      }
      if (grid[row + 1]?.[col - 1]?.special) {
        if (foundNearbySymbol === null) {
          foundNearbySymbol = [];
        }
        foundNearbySymbol.push({
          val: grid[row + 1]?.[col - 1]?.val,
          pos: `${row + 1}, ${col - 1}`,
        });
      }
      if (grid[row + 1]?.[col]?.special) {
        if (foundNearbySymbol === null) {
          foundNearbySymbol = [];
        }
        foundNearbySymbol.push({
          val: grid[row + 1]?.[col]?.val,
          pos: `${row + 1}, ${col}`,
        });
      }
      if (grid[row + 1]?.[col + 1]?.special) {
        if (foundNearbySymbol === null) {
          foundNearbySymbol = [];
        }
        foundNearbySymbol.push({
          val: grid[row + 1]?.[col + 1]?.val,
          pos: `${row + 1}, ${col + 1}`,
        });
      }
    } else {
      // curr char is not a number
      if (isPartOfNum) {
        console.log(num, foundNearbySymbol);
        if (foundNearbySymbol !== null) {
          sum += +num;

          const foundGears = [
            ...new Set(
              foundNearbySymbol.filter((s) => s.val === '*').map((s) => s.pos)
            ),
          ];

          if (foundGears.length > 0) {
            res.push({
              num: +num,
              gears: foundGears,
            });

            foundGears.forEach((gear) => {
              if (!gearMap[gear]) {
                gearMap[gear] = new Set<number>();
              }
              gearMap[gear].add(+num);
            });
          }

          foundNearbySymbol = null;
        }

        isPartOfNum = false;
        num = '';
      }
    }
  }
}

// console.log({ sum });
console.log(res);

const filteredEntries = Object.entries(gearMap).filter(
  ([_key, val]) => val.size === 2
);

console.log('filteredEntries', filteredEntries);

const finalResult = filteredEntries.reduce((memo, entry) => {
  const [_key, [...val]] = entry;
  return memo + val[0] * val[1];
}, 0);
console.log({ finalResult });
