export const removeArrayDuplicatesByProp = <T>(
  arr: T[],
  prop: keyof T
): T[] => {
  return [
    ...arr.reduce((map, obj) => map.set(obj[prop], obj), new Map()).values(),
  ];
};
