import { map, reduce } from 'rxjs';
import { FileTypes, readFile } from './util/read-puzzle';

// const lines = readFile(FileTypes.sample);
const lines = readFile(FileTypes.sample2);

const textualNums = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

const digits = textualNums.map((_num, i) => '' + i);
const textualNumsRev = textualNums.map((t) => t.split('').reverse().join(''));

function getDigit(str: string, textual: string[]) {
  const foundDigits = digits
    .map((n, i) => ({ n, index: str.indexOf(n), val: i }))
    .filter((x) => x.index !== -1)
    .sort((a, b) => a.index - b.index);

  const foundTextualNums = textual
    .map((n, i) => ({ n, index: str.indexOf(n), val: i }))
    .filter((x) => x.index !== -1)
    .sort((a, b) => a.index - b.index);

  const digit = [...foundDigits, ...foundTextualNums].sort(
    (a, b) => a.index - b.index
  )[0].val;

  return digit;
}

function subNums(str: string) {
  const leftDigit = getDigit(str, textualNums);
  const rightDigit = getDigit(str.split('').reverse().join(''), textualNumsRev);

  return +('' + leftDigit + rightDigit);
}

lines
  .pipe(
    map((l) => {
      const realInp = subNums(l);

      const actualNum = realInp;

      console.log({ l, realInp, actualNum });
      return actualNum;
    }),
    reduce((memo, val) => memo + val, 0)
  )
  .subscribe({
    next: (r) => console.log(r),
    error: (err) => console.error(err),
    complete: () => console.log('Done.'),
  });
