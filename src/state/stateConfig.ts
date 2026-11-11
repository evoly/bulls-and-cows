export type BaseKey = 'bin' | 'oct' | 'dec' | 'hex';

export type AvailableBases = 2 | 8 | 10 | 16;

export type GameStatus = 'ready' | 'playing' | 'won' | 'gaveUp';

export interface BaseConfig {
    value: AvailableBases;
    label: string; // Для красивого вывода в UI (например, "Hexadecimal") TODO
    digits: string[];
}

// конфиг (статические данные, которые не меняются)
export const BASES_CONFIG: Record<BaseKey, BaseConfig> = {
    bin: { value: 2, label: 'Двоичная', digits: ['0', '1'] },
    oct: { value: 8, label: 'Восьмеричная', digits: ['0', '1', '2', '3', '4', '5', '6', '7'] },
    dec: { value: 10, label: 'Десятичная', digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] },
    hex: {
        value: 16,
        label: 'Шестнадцатеричная',
        digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'],
    },
};
