import { from, map } from 'rxjs';
import { FileTypes, readFileToArray } from './util/read-puzzle.mts';

const availCards = {
  A: 13,
  K: 12,
  Q: 11,
  J: 10,
  T: 9,
  '9': 8,
  '8': 7,
  '7': 6,
  '6': 5,
  '5': 4,
  '4': 3,
  '3': 2,
  '2': 1,
};

interface Hand {
  hand: string;
  val: number;
}

function processHand(hand: Hand) {
  const handArr = hand.hand.split('');
  const parsed = handArr.reduce<{ [key: string]: number }>((memo, val) => {
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

  return { hand: handArr, strength, val: hand.val };
}

function processHands(hands: Hand[]) {
  const sortedHands = hands
    .map((h) => processHand(h))
    .sort((a, b) => {
      const diff = a.strength - b.strength;
      if (diff !== 0) {
        return diff;
      }
      const mismatch = a.hand.findIndex(
        (cardA, i) => availCards[cardA] - availCards[b.hand[i]] !== 0
      );

      return mismatch !== -1
        ? availCards[a.hand[mismatch]] - availCards[b.hand[mismatch]]
        : 0;
    });

  return sortedHands;
}

async function part1(lines: string[]) {
  const parsedLines = lines.map((l) => {
    const [hand, val] = l.split(' ');
    return { hand, val: +val };
  });

  const processedHands = processHands(parsedLines);

  const result = processedHands.reduce((memo, currHand, i) => {
    return memo + currHand.val * (i + 1);
  }, 0);

  console.log(result);
}
async function part2(lines: string[]) {}

(async function () {
  // const linesFromPuzzle = readFileToArray('07', FileTypes.sample);
  const linesFromPuzzle = readFileToArray('07', FileTypes.sample2);
  await part1(linesFromPuzzle);

  const linesFromPuzzle2 = readFileToArray('07', FileTypes.sample2);
  await part2(linesFromPuzzle2);
})();
