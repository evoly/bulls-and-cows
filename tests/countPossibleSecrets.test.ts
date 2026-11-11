import { describe, expect, it } from 'vitest';
import { countPossibleSecrets } from '../src/logic/countPossibleSecrets';

describe('countPossibleSecrets', () => {
    it('counts permutations without repetition', () => {
        expect(countPossibleSecrets(2, 2)).toBe(2);
        expect(countPossibleSecrets(2, 8)).toBe(56);
        expect(countPossibleSecrets(4, 10)).toBe(5040);
        expect(countPossibleSecrets(6, 16)).toBe(5765760);
    });

    it('allows zero as the first digit', () => {
        expect(countPossibleSecrets(2, 3)).toBe(6);
    });

    it('returns 1 for zero length', () => {
        expect(countPossibleSecrets(0, 10)).toBe(1);
    });

    it('returns 0 when length exceeds base', () => {
        expect(countPossibleSecrets(3, 2)).toBe(0);
    });

    it('returns the same result on repeated calls', () => {
        expect(countPossibleSecrets(4, 10)).toBe(5040);
        expect(countPossibleSecrets(4, 10)).toBe(5040);
    });
});
