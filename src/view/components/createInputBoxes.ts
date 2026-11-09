import { createEl } from '../../helpers';

export const createInputBoxes = (guessLength: number): HTMLInputElement[] => {
    const inputs = [];
    for (let i = 1; i <= guessLength; i += 1) {
        const input: HTMLInputElement = createEl('input', {
            type: 'text',
            className: 'card-input',
            maxLength: 1,
        });
        // TODO
        input.setAttribute('aria-label', `number ${i}`);
        inputs.push(input);
    }
    return inputs;
};
