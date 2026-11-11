import { createEl } from '../../helpers';

export const createKeboardButtons = (digits: string[]) => {
    const backspaceButton = createEl('button', { className: `keyboard-backspace`, type: 'button', textContent: '⌫' });

    const buttons = digits.map((digit) => {
        const button = createEl('button', { className: `keyboard-btn`, textContent: digit, type: 'button' });
        button.dataset.value = `${digit}`;
        return button;
    });

    const submitButton = createEl('button', { className: `keyboard-submit`, type: 'submit', textContent: 'Go' });
    submitButton.disabled = true;
    return [backspaceButton, ...buttons, submitButton];
};
