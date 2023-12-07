import { readFileSync } from 'node:fs';
import { from } from 'rxjs';

export const enum FileTypes {
  'sample' = 'sample',
  'sample2' = 'sample2',
  'real' = 'real',
}

export const readFile = (num: string, type: FileTypes) => {
  const fileBuf = readFileSync(`src/data/${num}/${type}.txt`, 'utf-8');
  const lines = fileBuf.toString().split('\n');
  return from(lines.slice(0, lines.at(-1).length === 0 ? -1 : lines.length));
};

export const readFileToArray = (num: string, type: FileTypes) => {
  const fileBuf = readFileSync(`src/data/${num}/${type}.txt`, 'utf-8');
  const lines = fileBuf.toString().split('\n');
  return lines.slice(0, lines.at(-1).length === 0 ? -1 : lines.length);
};
