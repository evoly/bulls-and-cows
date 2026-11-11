import { describe, it, expect } from 'vitest';
import { createDigitValidator } from '../src/logic/createDigitValidator';

describe('createDigitValidator', () => {
    describe('Двоичная система (base = 2)', () => {
        const isBinaryDigit = createDigitValidator(2);

        it('должна возвращать true для "0" и "1"', () => {
            expect(isBinaryDigit('0')).toBe(true);
            expect(isBinaryDigit('1')).toBe(true);
        });

        it('должна возвращать false для цифр вне диапазона', () => {
            expect(isBinaryDigit('2')).toBe(false);
            expect(isBinaryDigit('9')).toBe(false);
        });

        it('должна возвращать false для букв', () => {
            expect(isBinaryDigit('a')).toBe(false);
        });
    });

    describe('Десятичная система (base = 10)', () => {
        const isDecimalDigit = createDigitValidator(10);

        it('должна возвращать true для цифр от 0 до 9', () => {
            expect(isDecimalDigit('0')).toBe(true);
            expect(isDecimalDigit('5')).toBe(true);
            expect(isDecimalDigit('9')).toBe(true);
        });

        it('должна возвращать false для букв', () => {
            expect(isDecimalDigit('a')).toBe(false);
            expect(isDecimalDigit('A')).toBe(false);
        });
    });
    describe('Восьмеричная система (base = 8)', () => {
        const isOctalDigit = createDigitValidator(8);

        it('должна возвращать true для цифр от 0 до 7', () => {
            expect(isOctalDigit('0')).toBe(true);
            expect(isOctalDigit('4')).toBe(true);
            expect(isOctalDigit('7')).toBe(true);
        });

        it('должна возвращать false для цифр 8 и 9', () => {
            expect(isOctalDigit('8')).toBe(false);
            expect(isOctalDigit('9')).toBe(false);
        });

        it('должна возвращать false для букв', () => {
            expect(isOctalDigit('a')).toBe(false);
            expect(isOctalDigit('A')).toBe(false);
        });
    });

    describe('Шестнадцатеричная система (base = 16)', () => {
        const isHexDigit = createDigitValidator(16);

        it('должна возвращать true для обычных цифр', () => {
            expect(isHexDigit('0')).toBe(true);
            expect(isHexDigit('9')).toBe(true);
        });

        it('должна быть регистронезависимой для букв A-F', () => {
            expect(isHexDigit('a')).toBe(true);
            expect(isHexDigit('A')).toBe(true);
            expect(isHexDigit('f')).toBe(true);
            expect(isHexDigit('F')).toBe(true);
        });

        it('должна возвращать false для букв вне HEX-диапазона', () => {
            expect(isHexDigit('g')).toBe(false);
            expect(isHexDigit('G')).toBe(false);
            expect(isHexDigit('z')).toBe(false);
        });
    });

    describe('Краевые случаи и валидация ввода', () => {
        const isHexDigit = createDigitValidator(16);

        it('должна возвращать false, если передан пустой флаг или строка из нескольких символов', () => {
            expect(isHexDigit('')).toBe(false);
            expect(isHexDigit('10')).toBe(false);
            expect(isHexDigit('ab')).toBe(false);
        });

        it('должна возвращать false для пробелов и спецсимволов', () => {
            expect(isHexDigit(' ')).toBe(false);
            expect(isHexDigit('\n')).toBe(false);
            expect(isHexDigit('-')).toBe(false);
        });
    });
});
