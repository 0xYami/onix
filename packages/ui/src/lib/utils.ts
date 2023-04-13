import { asyncFaillable, type Asset } from '@onix/utils';

export function truncateMiddleString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  const leftHalfLength = Math.ceil((maxLength - 3) / 2);
  const rightHalfLength = Math.floor((maxLength - 3) / 2);
  return str.slice(0, leftHalfLength) + '...' + str.slice(str.length - rightHalfLength);
}

export async function copyToClipboard(str: string) {
  const result = await asyncFaillable(navigator.clipboard.writeText(str));
  if (result.failed) {
    console.error('Failed to copy', result.reason);
  }
}

export const assetSymbolToLogoURL: Record<Asset['symbol'], `/logos/${string}`> = {
  ETH: '/logos/eth.svg',
  USDT: '/logos/usdt.svg',
  USDC: '/logos/usdc.svg',
  DAI: '/logos/dai.svg',
  MATIC: '/logos/matic.svg',
  LINK: '/logos/link.svg',
  UNI: '/logos/uni.svg',
  LDO: '/logos/ldo.svg',
  MKR: '/logos/mkr.svg',
  AAVE: '/logos/aave.svg',
  APE: '/logos/ape.svg',
};
