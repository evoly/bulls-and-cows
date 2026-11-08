import { describe, it, expect } from 'vitest';

import { generateSecret } from '../src/logic/generateSecret';

type Radix = 'bin' | 'oct' | 'dec' | 'hex';

const fixedRandom = () => 0.5;

const testCases: { base: Radix; allowedDigits: string[] }[] = [
  { base: 'bin', allowedDigits: ['0', '1'] },
  { base: 'oct', allowedDigits: '01234567'.split('') },
  { base: 'dec', allowedDigits: '0123456789'.split('') },
  { base: 'hex', allowedDigits: '0123456789abcdef'.split('') },
];

describe('generateSecret', () => {
  it('generates a secret of the requested length', () => {
    for (const length of [2, 3, 4, 5, 6]) {
      const secret = generateSecret(length, 'dec', fixedRandom);
      expect(secret).toHaveLength(length);
    }
  });

  it('generates digits without duplicates', () => {
    const secret = generateSecret(6, 'dec', fixedRandom);
    expect(new Set(secret).size).toBe(secret.length);
  });

  it.each(testCases)('uses only valid digits for $base', ({ base, allowedDigits }) => {
    const secret = generateSecret(2, base, fixedRandom);
    expect(secret.every((digit) => allowedDigits.includes(digit))).toBe(true);
  });

  it('produces predictable results with a fixed random function', () => {
    const first = generateSecret(4, 'dec', fixedRandom);
    const second = generateSecret(4, 'dec', fixedRandom);
    expect(first).toEqual(second);
  });

  it.each([0, 1, 7, -1])('throws an error for invalid length %i', (length) => {
    expect(() => generateSecret(length, 'dec', fixedRandom)).toThrow();
  });

  it('does not mutate the original digit sets between calls', () => {
    const first = generateSecret(6, 'dec', () => 0);
    const second = generateSecret(6, 'dec', () => 0);
    expect(first).toEqual(second);
  });
});
