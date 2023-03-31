import { BigNumber } from 'bignumber.js';

export function startsWith(str: string, prefix: string): boolean {
  if (str.length < prefix.length) return false;
  return str.slice(0, prefix.length) === prefix;
}

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

export function formatNFTImageUrl(imageURL: string): string {
  if (startsWith(imageURL, 'ipfs')) {
    return `https://ipfs.io/ipfs/${imageURL.split('ipfs://')[1]}`;
  }
  return imageURL;
}
