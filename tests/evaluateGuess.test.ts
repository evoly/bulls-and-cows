import { describe, expect, it } from 'vitest';
import { evaluateGuess } from '../src/logic/evaluateGuess';

describe('evaluateGuess', () => {
  it('returns all bulls when the guess matches the secret', () => {
    expect(evaluateGuess(['1', '2', '3', '4'], ['1', '2', '3', '4'])).toEqual({
      bulls: 4,
      cows: 0,
    });
  });

  it('returns all cows when every digit is in the wrong position', () => {
    expect(evaluateGuess(['1', '2', '3', '4'], ['4', '3', '2', '1'])).toEqual({
      bulls: 0,
      cows: 4,
    });
  });

  it('returns zero bulls and cows when no digits match', () => {
    expect(evaluateGuess(['1', '2', '3', '4'], ['5', '6', '7', '8'])).toEqual({
      bulls: 0,
      cows: 0,
    });
  });

  it('counts both bulls and cows correctly', () => {
    expect(evaluateGuess(['1', '2', '3', '4'], ['1', '4', '3', '5'])).toEqual({
      bulls: 2,
      cows: 1,
    });
  });

  it('does not count bulls as cows', () => {
    expect(evaluateGuess(['1', '2', '3', '4'], ['1', '2', '4', '5'])).toEqual({
      bulls: 2,
      cows: 1,
    });
  });

  it('supports binary digits', () => {
    expect(evaluateGuess(['0', '1'], ['1', '0'])).toEqual({ bulls: 0, cows: 2 });
  });

  it('supports hexadecimal digits', () => {
    expect(evaluateGuess(['a', '1', 'f', '3'], ['f', '1', 'a', '4'])).toEqual({
      bulls: 1,
      cows: 2,
    });
  });

  it('supports six-digit secrets', () => {
    expect(evaluateGuess(['a', 'b', 'c', 'd', 'e', 'f'], ['a', 'b', 'c', 'f', 'e', 'd'])).toEqual({
      bulls: 4,
      cows: 2,
    });
  });
});
