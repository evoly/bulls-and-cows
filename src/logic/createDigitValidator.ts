export const createDigitValidator =
    (base: number) =>
    (char: string): boolean =>
        char.length === 1 && parseInt(char, base).toString(base) === char.toLowerCase();
