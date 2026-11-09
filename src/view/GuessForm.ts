import { createEl } from './../helpers';
import { createDigitValidator } from '../logic/createDigitValidator';
import { createInputBoxes } from './components/createInputBoxes';
import { createKeboardButtons } from './components/createKeboardButtons';

import { state } from '../state/state';
import { BASES_CONFIG } from '../state/stateConfig';

let keyboardController: AbortController | null = null; //clean up document.addEventLIstener

// handlers:
const handleInput = (char: string, inputs: HTMLInputElement[], buttons: HTMLButtonElement[]) => {
    const radix = BASES_CONFIG[state.currentBase].value;
    const { guess, guessLength } = state;

    if (!createDigitValidator(radix)(char)) return;

    if (guess.includes(char)) return;
    if (guess.length >= guessLength) return;

    const numberOfGuess = guess.length;

    const newGuess = [...guess, char];
    state.guess = newGuess;

    inputs[numberOfGuess]!.value = char;

    const currentButton = buttons.find((button) => button.dataset.value === char);
    if (currentButton) {
        currentButton.disabled = true;
    }

    if (newGuess.length === guessLength) {
        const submit = buttons.find((button) => button.type === 'submit');
        if (submit) {
            submit.disabled = false;
        }
        /* check guess here */
        // Разблокировать отправку (кнопку Go)
    }
};

const handleBackspace = (inputs: HTMLInputElement[], buttons: HTMLButtonElement[]) => {
    const { guess } = state;
    if (guess.length === 0) return;

    const lastChar = guess[guess.length - 1];
    const newGuess = guess.slice(0, -1);
    state.guess = newGuess;

    inputs[guess.length - 1]!.value = '';

    const currentButton = buttons.find((button) => button.dataset.value === lastChar);
    if (currentButton) {
        currentButton.disabled = false;
    }

    const submitButton = buttons.find((button) => button.type === 'submit');

    if (submitButton) {
        submitButton.disabled = true;
    }
};

// render:
const Keyboard = (buttons: HTMLButtonElement[]) => {
    const container = createEl('div', { className: 'keyboard' });
    container.append(...buttons);
    return container;
};

const CurrentGuess = (inputs: HTMLInputElement[]) => {
    const card = createEl('div', { className: 'card', ariaLabel: 'Your guesses' });

    if (state.isStarted) {
        state.tries += 1;
    }

    const n: HTMLElement = createEl('div', { className: 'card-number', textContent: `${state.tries + 1}` });

    const fieldset: HTMLElement = createEl('fieldset');
    const legend: HTMLElement = createEl('legend', {
        className: 'visually-hidden',
        textContent: `enter ${state.guessLength} digits`,
    });

    const content: HTMLElement = createEl('div', { className: 'fieldset-content' });

    content.append(...inputs);
    fieldset.append(legend, content);
    card.append(n, fieldset);
    return card;
};

export const GuessForm = (): { container: HTMLFormElement; update: () => void } => {
    const container = createEl('form', { className: 'game-form', id: 'game-form' });

    let inputBoxes: HTMLInputElement[] = [];
    let keyboardButtons: HTMLButtonElement[] = [];

    const update = () => {
        const digits = BASES_CONFIG[state.currentBase].digits;

        keyboardButtons = createKeboardButtons(digits);
        inputBoxes = createInputBoxes(state.guessLength);

        container.replaceChildren(CurrentGuess(inputBoxes), Keyboard(keyboardButtons));
    };

    update();

    // Удаляем предыдущий обработчик
    keyboardController?.abort();
    keyboardController = new AbortController();

    document.addEventListener(
        'keydown',
        (e) => {
            // Не перехватываем ввод в других полях
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                e.target instanceof HTMLSelectElement ||
                (e.target instanceof HTMLElement && e.target.isContentEditable)
            ) {
                return;
            }

            if (e.ctrlKey || e.altKey || e.metaKey) return;

            if (e.key === 'Backspace') {
                e.preventDefault();
                handleBackspace(inputBoxes, keyboardButtons);
                return;
            }

            if (e.key.length === 1) {
                e.preventDefault();
                handleInput(e.key, inputBoxes, keyboardButtons);
            }
        },
        { signal: keyboardController.signal },
    );

    container.addEventListener('click', (e) => {
        if (!(e.target instanceof HTMLButtonElement)) return;

        const target = e.target;

        if (target.classList.contains('keyboard-btn')) {
            const char = target.textContent || '';
            handleInput(char, inputBoxes, keyboardButtons);
            return;
        }

        if (target.classList.contains('keyboard-backspace')) {
            handleBackspace(inputBoxes, keyboardButtons);
            return;
        }
    });

    container.addEventListener('submit', (e) => {
        e.preventDefault();
        // TODO: evaluate guess
    });

    return { container, update };
};
