const BASE_PATH = '/DataVis-Project';
export const getStaticFile = (path: string) => {
  return path.startsWith('/') ? BASE_PATH + path : BASE_PATH + '/' + path;
};

type CompareFn<T> = ((a: T, b: T) => number) | undefined;

export function foundOrFirst<T>(
  valueToFind: T,
  list: T[],
  compareFn?: CompareFn<T>
): T {
  if (list.includes(valueToFind)) return valueToFind;
  return list.sort(compareFn)[0];
}

export function getUnique<T>(list: T[], compareFn?: CompareFn<T>): T[] {
  return [...new Set(list)].sort(compareFn);
}
