export function truncateMiddle(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  const leftHalfLength = Math.ceil((maxLength - 3) / 2);
  const rightHalfLength = Math.floor((maxLength - 3) / 2);
  return str.slice(0, leftHalfLength) + "..." + str.slice(str.length - rightHalfLength);
}
