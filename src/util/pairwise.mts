export function pairwise<T>(arr: T[]) {
  if (arr.length < 2) {
    throw new Error('pairwise needs at least 2 elements');
  }
  const [first, ...rest] = arr;

  return rest.reduce(
    (memo, val) => {
      memo.accum.push([memo.previous, val]);
      memo.previous = val;
      return memo;
    },
    { previous: first, accum: [] as [T, T][] }
  ).accum;
}
