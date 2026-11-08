type Score = { bulls: number; cows: number };

export const evaluateGuess = (secret: string[], guess: string[]): Score => ({
  bulls: secret.filter((item, index) => item === guess[index]).length,
  cows: secret.filter((item, index) => item !== guess[index] && guess.includes(item)).length,
});
