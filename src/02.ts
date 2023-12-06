import { map, reduce } from 'rxjs';
import { FileTypes, readFile } from './util/read-puzzle';

// const lines = readFile('02', FileTypes.sample);
const lines = readFile('02', FileTypes.sample2);

const types = {
  red: 12,
  green: 13,
  blue: 14,
};
/* 
lines
  .pipe(
    map((l) => {
      let ok = true;
      const res = /Game (?<id>\d+): (?<rest>.+)/.exec(l);
      res.groups.rest.split('; ').map((r) => {
        r.split(', ').forEach((v) => {
          const [count, type] = v.split(' ');
          if (+count > types[type]) {
            ok = false;
          }
        });
      });
      return ok ? +res.groups.id : 0;
    }),
    reduce((memo, val) => memo + val, 0)
  )
  .subscribe({
    next: (r) => console.log(r),
    error: (err) => console.error(err),
    complete: () => console.log('Done.'),
  });
 */
lines
  .pipe(
    map((l) => {
      const dynamicTypes = {
        red: 0,
        green: 0,
        blue: 0,
      };
      const res = /Game (?<id>\d+): (?<rest>.+)/.exec(l);
      res.groups.rest.split('; ').map((r) => {
        r.split(', ').forEach((v) => {
          const [count, type] = v.split(' ');
          dynamicTypes[type] = Math.max(dynamicTypes[type], +count);
        });
      });
      return dynamicTypes['red'] * dynamicTypes['blue'] * dynamicTypes['green'];
    }),
    reduce((memo, val) => memo + val, 0)
  )
  .subscribe({
    next: (r) => console.log(r),
    error: (err) => console.error(err),
    complete: () => console.log('Done.'),
  });
