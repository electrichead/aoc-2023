import { readFileSync } from 'node:fs';
import { from } from 'rxjs';

export const enum FileTypes {
  'sample' = 'sample',
  'sample2' = 'sample2',
  'real' = 'real',
}

export const readFile = (num: string, type: FileTypes) => {
  const fileBuf = readFileSync(`src/data/${num}/${type}.txt`, 'utf-8');
  return from(fileBuf.toString().split('\n').slice(0, -1));
};

export const readFileToArray = (num: string, type: FileTypes) => {
  const fileBuf = readFileSync(`src/data/${num}/${type}.txt`, 'utf-8');
  return fileBuf.toString().split('\n').slice(0, -1);
};
