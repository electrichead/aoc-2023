import { concatMap, from, generate, last, map, pairwise, scan } from 'rxjs';
import { FileTypes, readFileToArray } from './util/read-puzzle.mts';
import { memoize } from 'lodash';

// const linesFromPuzzle = readFileToArray('05', FileTypes.sample);
const linesFromPuzzle = readFileToArray('05', FileTypes.sample2);

interface Conversion {
  src: string;
  dest: string;
  convs: {
    dest: number;
    src: number;
    count: number;
    finish: number;
  }[];
}

function buildConversions(lines: string[]) {
  const seedList = lines[0]
    .replace('seeds: ', '')
    .split(' ')
    .map((s) => +s);

  const conversionData = lines
    .slice(2)
    .reduce((memo, line) => {
      if (line.length === 0) {
        return memo;
      }

      if (/[a-z]/.test(line.charAt(0))) {
        // new conversion
        const parsedLine = line.match(/(?<src>[a-z]+)-to-(?<dest>[a-z]+)/);
        if (
          !parsedLine.groups ||
          !parsedLine.groups.src ||
          !parsedLine.groups.dest
        ) {
          throw new Error('parsing issue in line' + line);
        }

        memo.push({
          src: parsedLine.groups.src,
          dest: parsedLine.groups.dest,
          convs: [],
        });
      } else {
        const parsedLine = line.split(' ');
        memo.at(-1).convs.push({
          dest: +parsedLine[0],
          src: +parsedLine[1],
          count: +parsedLine[2],
          finish: +parsedLine[1] + +parsedLine[2],
        });
      }
      return memo;
    }, [] as Conversion[])
    .map((conv) => ({
      ...conv,
      convs: conv.convs.sort((a, b) => b.src - a.src),
    }));

  return { seedList, conversionData };
}

function part1(lines: string[]) {
  const { seedList, conversionData } = buildConversions(lines);

  const converterFns = conversionData.map((c) => (val: number) => {
    const found = c.convs.find(
      (conv) => val >= conv.src && val <= conv.src + conv.count
    );

    return found ? found.dest + (val - found.src) : val;
  });

  const sortedResults = seedList.reduce(
    (memo, seed) =>
      Math.min(
        converterFns.reduce((memo, convertFn) => convertFn(memo), seed),
        memo
      ),
    Number.MAX_SAFE_INTEGER
  );

  // console.log(sortedResults);
}

function getSeedRanges(
  seedList: number[],
  accum: { start: number; count: number }[]
) {
  if (seedList.length === 0) {
    return accum;
  }

  const [start, count, ...rest] = seedList;

  return getSeedRanges(rest, [...accum, { start, count }]);
}

async function part2(lines: string[]) {
  const { seedList, conversionData } = buildConversions(lines);
  const seedRanges = getSeedRanges(seedList, []).sort(
    (a, b) => a.start - b.start
  );

  let minLocation = Number.MAX_SAFE_INTEGER;

  const converterFns = conversionData.map((c) =>
    ((convs) => (val: number) => {
      const found = convs.find(
        (conv) => val >= conv.src && val <= conv.src + conv.count
      );

      return found ? found.dest + (val - found.src) : val;
    })(c.convs)
  );

  const processSingleSeed = async (seed: number, minLocationSoFar: number) => {
    const locationResult = converterFns.reduce(
      (memo, convertFn) => convertFn(memo),
      seed
    );

    return Math.min(locationResult, minLocationSoFar);
  };

  const processSeeds = async (seeds: number[], minLocation: number) => {
    // console.log('\nprocess seeds', seeds);
    if (seeds.length === 0) {
      return minLocation;
    }

    const [start, count, ...rest] = seeds;

    if (count === 0) {
      // console.log('count === 0', rest, minLocation);
      return processSeeds(rest, minLocation);
    }

    const currMinLocation = await processSingleSeed(start, minLocation);

    // console.log({ currMinLocation });

    const nextMinLocation = Math.min(currMinLocation, minLocation);

    // console.log('default', [start + 1, count - 1, ...rest], nextMinLocation);

    return processSeeds([start + 1, count - 1, ...rest], nextMinLocation);
  };

  for (let firstPair of seedRanges) {
    for (
      let i = firstPair.start, max = firstPair.start + firstPair.count;
      i < max;
      i++
    ) {
      minLocation = await processSingleSeed(i, minLocation);
    }
  }
  // const minLocation = processSeeds(seedList, Number.MAX_SAFE_INTEGER);

  console.log(minLocation);
}

(async function () {
  // part1(linesFromPuzzle);
  await part2(linesFromPuzzle);
})();
