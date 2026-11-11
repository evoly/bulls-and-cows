type Radix = 'bin' | 'oct' | 'dec' | 'hex';

type DigitSets = Record<Radix, string[]>;

const digits: DigitSets = {
    bin: ['0', '1'],
    oct: ['0', '1', '2', '3', '4', '5', '6', '7'],
    dec: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    hex: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'],
};

const shuffle = (array: string[], random: () => number): string[] => {
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(random() * (i + 1));
        [array[i], array[j]] = [array[j]!, array[i]!];
    }
    return array;
};

export const generateSecret = (length: number, base: Radix, random = Math.random) => {
    if (base === undefined) throw Error('no base in generateSecret');
    if (length < 2 || length > 6) throw Error('wrong length in generateSecret');

    const result = shuffle([...digits[base]], random).slice(0, length);
    return result;
};
