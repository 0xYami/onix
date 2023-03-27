import BigNumber from 'bignumber.js';

export function take<T>(arr: Array<T>, size: number): T[] {
  if (!arr.length) return [];

  const length = arr.length < size ? arr.length : size;
  const result = Array<T>(length);

  for (let i = 0; i < length; i++) {
    result[i] = arr[i];
  }

  return result;
}

export function toBaseUnit(value: string, decimals: number) {
  return BigNumber(value).div(BigNumber(10).pow(decimals));
}
