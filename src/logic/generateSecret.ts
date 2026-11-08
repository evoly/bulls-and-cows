type Radix = 'bin' | 'oct' | 'dec' | 'hex';

export const generateSecret = (length: number, base: Radix, random = Math.random): string[] => {
  throw new Error(`not implemented for ${length} ${base} ${random}`);
};
