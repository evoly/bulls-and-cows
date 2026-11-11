import { createEl } from './../helpers';
import { formatTime } from './../helpers';
import { createDigitValidator } from '../logic/createDigitValidator';
import { evaluateGuess } from '../logic/evaluateGuess';
import { isValidGuess } from '../logic/isValidGuess';
import { createWinModal } from './Modals';
import { createInputBoxes } from './components/createInputBoxes';
import { createKeboardButtons } from './components/createKeboardButtons';

import { state } from '../state/state';
import { BASES_CONFIG } from '../state/stateConfig';
import { BaseKey } from '../state/stateConfig';

type GuessFormProps = {
    onHistoryChange: () => void;
    timer: { stop: () => void; getElapsedSeconds: () => number };
    onWin: () => void;
};

let keyboardController: AbortController | null = null; //clean up document.addEventLIstener

// handlers:
const handleInput = (char: string, inputs: HTMLInputElement[], buttons: HTMLButtonElement[]) => {
    const radix = BASES_CONFIG[state.currentBase].value;
    const { guess, guessLength } = state;

    if (!createDigitValidator(radix)(char)) return;

    const normalizedChar = char.toLowerCase();

    if (guess.includes(normalizedChar)) return;
    if (guess.length >= guessLength) return;

    const numberOfGuess = guess.length;

    const newGuess = [...guess, normalizedChar];
    state.guess = newGuess;

    inputs[numberOfGuess]!.value = normalizedChar;

    const currentButton = buttons.find((button) => button.dataset.value === normalizedChar);
    if (currentButton) {
        currentButton.disabled = true;
    }

    if (newGuess.length === guessLength) {
        const submit = buttons.find((button) => button.type === 'submit');
        if (submit) {
            submit.disabled = false;
        }
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

export const GuessForm = ({
    onHistoryChange,
    timer,
    onWin,
}: GuessFormProps): { container: HTMLFormElement; update: () => void; revealSecret: () => void } => {
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

            if (state.gameStatus !== 'playing') return;

            if (e.ctrlKey || e.altKey || e.metaKey) return;

            if (e.key === 'Backspace') {
                e.preventDefault();
                handleBackspace(inputBoxes, keyboardButtons);
                return;
            }

            if (e.key === 'Enter') {
                if (state.guess.length !== state.guessLength) return;

                e.preventDefault();
                container.requestSubmit();
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
        if (state.gameStatus !== 'playing') return;
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
        if (state.gameStatus !== 'playing') return;

        const { guess, secret, guessLength, history, currentBase } = state;
        const base = BASES_CONFIG[currentBase].value;

        if (!isValidGuess(guess, guessLength, base)) return;

        const isDuplicate = history.some(
            (entry) => entry.guess.join('').toLowerCase() === guess.join('').toLowerCase(),
        );

        if (isDuplicate) return;

        state.tries += 1;

        const { bulls, cows } = evaluateGuess(secret, guess);
        const roundResult = { guess, bulls, cows };
        state.history = [...history, roundResult];

        if (bulls === guessLength) {
            state.gameStatus = 'won';
            timer.stop();
            onWin();
            const time = timer.getElapsedSeconds();

            createWinModal(state.tries, formatTime(time), currentBase);

            type Game = {
                tries: number;
                date: number;
                time: number;
                base: BaseKey;
                length: number;
            };

            type BestGames = Partial<Record<BaseKey, Game[]>>;

            const storageKey = 'bulls-and-cows-bestgames';
            const stored = localStorage.getItem(storageKey);

            let bestGames: BestGames = {};

            if (stored) {
                try {
                    bestGames = JSON.parse(stored);
                } catch {
                    throw new Error('Cannot parse data from localStorage');
                }
            }

            const newResult: Game = {
                tries: state.tries,
                time,
                base: currentBase,
                length: guessLength,
                date: Date.now(),
            };

            const currentResults = bestGames[currentBase] ?? [];
            bestGames[currentBase] = [...currentResults, newResult]
                .sort((a, b) => a.tries - b.tries || a.time - b.time)
                .slice(0, 10);

            localStorage.setItem(storageKey, JSON.stringify(bestGames));

            return;
        }

        state.guess = [];
        update();
        onHistoryChange();
    });

    const revealSecret = () => {
        inputBoxes.forEach((input, index) => {
            input.value = state.secret[index] ?? '';
            input.disabled = true;
        });

        keyboardButtons.forEach((button) => {
            button.disabled = true;
        });
    };

    return { container, update, revealSecret };
};
