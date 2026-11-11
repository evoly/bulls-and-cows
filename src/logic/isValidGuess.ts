import { createDigitValidator } from './createDigitValidator';

export const isValidGuess = (guess: string[], length: number, base: number): boolean => {
    if (guess.length !== length) return false;

    const isValidDigit = createDigitValidator(base);

    if (!guess.every(isValidDigit)) return false;

    const uniqueDigits = new Set(guess.map((digit) => digit.toLowerCase()));

    return uniqueDigits.size === length;
};
