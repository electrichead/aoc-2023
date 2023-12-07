import { FileTypes, readFileToArray } from './util/read-puzzle.mts';

const availCardsWithJ = {
  A: 13,
  K: 12,
  Q: 11,
  T: 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
  J: 1,
};

interface Hand {
  hand: string;
  val: number;
}

function getStrengthForNormalHand(arr: string[]) {
  const parsed = arr.reduce<{ [key: string]: number }>((memo, val) => {
    if (!memo[val]) {
      memo[val] = 0;
    }
    memo[val]++;

    return memo;
  }, {});

  const strength = Object.values(parsed)
    .filter((s) => s !== 1)
    .reduce((memo, val) => {
      return memo + Math.pow(10, val);
    }, 0);

  return strength;
}

function getStrengthForHandWithJ(arr: string[], numJs: number) {
  if (numJs === 5) {
    return Math.pow(10, 5);
  }

  const parsed = arr
    .filter((a) => a !== 'J')
    .reduce<{ [key: string]: number }>((memo, val) => {
      if (!memo[val]) {
        memo[val] = 0;
      }
      memo[val]++;

      return memo;
    }, {});

  /* Possibilities
    { Q: 2 } + {1-3}J
    { Q: 3 } + {1-2}J
    { Q: 4 } + {1}J
    { Q: 2, K: 2} + {1}J
    
    singles + {1-4}J
    5J
    */

  const entries = Object.entries(parsed).sort((a, b) => a[1] - b[1]); //?

  const entriesOver1 = entries.filter(([_key, val]) => val > 1);

  const is2Pair = entriesOver1.length === 2;

  if (is2Pair) {
    const found = entries.find(([_key, val]) => val === 2);
    if (found) {
      found[1]++;
    }

    return entries
      .filter(([_, val]) => val !== 1)
      .reduce((memo, [_, val]) => {
        return memo + Math.pow(10, val);
      }, 0);
  }

  if (entriesOver1.length === 0) {
    // only singles
    entries[0][1] += numJs;

    return entries
      .filter(([_, val]) => val !== 1)
      .reduce((memo, [_, val]) => {
        return memo + Math.pow(10, val);
      }, 0);
  } else {
    entriesOver1[0][1] += numJs;

    return entriesOver1.reduce((memo, [_, val]) => {
      return memo + Math.pow(10, val);
    }, 0);
  }
}

function processHandWithJ({ hand, val }: Hand) {
  const handArr = hand.split('');

  const numJs = hand.match(/J/g);

  const strength =
    numJs === null
      ? getStrengthForNormalHand(handArr)
      : getStrengthForHandWithJ(handArr, numJs.length);

  return { hand: handArr, strength, val };
}

async function part2(lines: string[]) {
  const parsedLines = lines.map((l) => {
    const [hand, val] = l.split(' ');
    return { hand, val: +val };
  });

  const processedHands = parsedLines
    .map((h) => processHandWithJ(h))
    .sort((a, b) => {
      const diff = a.strength - b.strength;
      if (diff !== 0) {
        return diff;
      }
      const mismatch = a.hand.findIndex(
        (cardA, i) => availCardsWithJ[cardA] - availCardsWithJ[b.hand[i]] !== 0
      );

      return mismatch !== -1
        ? availCardsWithJ[a.hand[mismatch]] - availCardsWithJ[b.hand[mismatch]]
        : 0;
    });

  const result = processedHands.reduce((memo, currHand, i) => {
    return memo + currHand.val * (i + 1);
  }, 0);

  console.log(result);
}

(async function () {
  // const linesFromPuzzle2 = readFileToArray('07', FileTypes.sample2);
  const linesFromPuzzle2 = readFileToArray('07', FileTypes.sample2);
  await part2(linesFromPuzzle2);
})();

/* 
  Part 2 was tricky here. I had to throw all my assumptions and code away from part 1.
  
  There are also lots of intermediary structures and isntances of code duplication; I could probably clean this up a lot. But there are a lot of edge cases here.
  
  That mapping to power of 10 was good though. Also, prototyping this in Quokka helped a lot.
*/
