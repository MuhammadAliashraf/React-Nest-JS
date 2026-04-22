export function generateCode(
  count: number,
  prefix: string,
  length = 6,
): string {
  const nextCount = (count || 0) + 1;
  return `${prefix}${String(nextCount).padStart(length, '0')}`;
}
