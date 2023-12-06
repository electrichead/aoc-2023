import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { resolve } from 'node:path';

const argv = yargs(hideBin(process.argv)).argv;
const paddedDay = +argv['day'] < 10 ? `0${argv['day']}` : argv['day'];

if (!argv['day'] || isNaN(+argv['day'])) {
  throw new Error('Please provide option for day');
}

const getSample = async (day) => {
  const response = await fetch(
    `https://adventofcode.com/2023/day/${day}/input`,
    {
      headers: {
        credentials: 'include',
        cookie:
          'session=53616c7465645f5f2d407bb3070f3f113f68e5750c0d91b7dece89998dd006ea6243dc947347d0fb18e60ab7527156e8ea4c83a24660bab3e659ba6a6c28c538',
      },
    }
  );

  const text = await response.text();

  writeFileSync(resolve(`src/data/${paddedDay}/sample2.txt`), text);
};

if (!existsSync(`src/data/${paddedDay}`)) {
  mkdirSync(`src/data/${paddedDay}`);

  const template = readFileSync('src/template.ts');
  writeFileSync(
    resolve(`src/${paddedDay}.ts`),
    template.toString().replace(/<%day%>/g, paddedDay)
  );
} else {
  throw new Error('Folder for this day already exists!');
}

getSample(argv['day']);
