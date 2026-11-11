import { createEl } from '../../helpers';

type HistoryEntry = {
    guess: string[];
    bulls: number;
    cows: number;
};

export const createHistoryCards = (history: HistoryEntry[]): HTMLElement[] => {
    return history.map(({ guess, bulls, cows }, index) => {
        const card = createEl('div', { className: 'card history' });
        card.setAttribute('role', 'group');
        card.setAttribute('aria-label', `Guess ${index + 1}`);

        const number = createEl('div', { className: 'card-number' });
        number.textContent = String(index + 1);

        const content = createEl('ul', { className: 'card-list' });
        const digits = guess.map((digit) => {
            const item = createEl('li', { className: 'card-list-item' });
            item.textContent = digit;
            return item;
        });
        content.append(...digits);

        const hints = createEl('div', { className: 'card-hints' });

        const bullHint = createEl('span', { className: 'card-hint' });
        bullHint.textContent = `${bulls} 🐂`;

        const cowHint = createEl('span', { className: 'card-hint' });
        cowHint.textContent = `${cows} 🐄`;

        hints.append(bullHint, cowHint);
        card.append(number, content, hints);

        return card;
    });
};
