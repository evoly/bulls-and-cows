type Score = { bulls: number; cows: number };

export const evaluateGuess = (secret: string[], guess: string[]): Score => {
    const normalizedSecret = secret.map((digit) => digit.toLowerCase());
    const normalizedGuess = guess.map((digit) => digit.toLowerCase());

    return {
        bulls: normalizedSecret.filter((digit, index) => digit === normalizedGuess[index]).length,
        cows: normalizedSecret.filter(
            (digit, index) => digit !== normalizedGuess[index] && normalizedGuess.includes(digit),
        ).length,
    };
};
