import { describe, expect, it } from 'vitest';
import { isValidGuess } from '../src/logic/isValidGuess';

describe('isValidGuess', () => {
    it.each([
        { guess: ['0', '1'], length: 2, base: 2 },
        { guess: ['0', '7', '3'], length: 3, base: 8 },
        { guess: ['1', '9', '4'], length: 3, base: 10 },
        { guess: ['a', 'F', '3'], length: 3, base: 16 },
    ])('accepts valid guess in base $base', ({ guess, length, base }) => {
        expect(isValidGuess(guess, length, base)).toBe(true);
    });

    it('rejects a guess with incorrect length', () => {
        expect(isValidGuess(['1', '2'], 3, 10)).toBe(false);
    });

    it.each([
        { guess: ['0', '2'], base: 2 },
        { guess: ['7', '8'], base: 8 },
        { guess: ['9', 'a'], base: 10 },
        { guess: ['a', 'g'], base: 16 },
    ])('rejects invalid digits in base $base', ({ guess, base }) => {
        expect(isValidGuess(guess, 2, base)).toBe(false);
    });

    it('rejects repeated digits', () => {
        expect(isValidGuess(['1', '2', '1'], 3, 10)).toBe(false);
    });

    it('treats uppercase and lowercase hex digits as duplicates', () => {
        expect(isValidGuess(['a', 'A'], 2, 16)).toBe(false);
    });

    it('rejects a multi-character array element', () => {
        expect(isValidGuess(['10', 'a'], 2, 16)).toBe(false);
    });
});
