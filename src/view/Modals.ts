import { createEl } from './../helpers';

import createModal from './components/Modal';
// import createTable from "./components/ResultTable";

// import { createFireworks } from './fireworks';
/*
interface BestGame {
    tries: number;
    date: string;
    time: string;
    length: number;
    radix: number;
}

const createLeaderBoard = () => {
    const stored = localStorage.getItem('bestgames');
    const bestGames: BestGame[] = stored ? JSON.parse(stored) : [];

    if (!bestGames) {
        const emptyTableText = createEl('div');
        emptyTableText.textContent = 'Nothing here yet';
        return createModal([emptyTableText]);
    }

    bestGames.forEach(game => {
        game.date = new Date(game.date).toLocaleDateString('ru');
    });

    return createModal(createTable(bestGames));
};
*/

export const createWinModal = (tries: number, time: string) => {
    const header = createEl('h2');
    header.textContent = 'Congratulations!';

    const text = createEl('p');
    text.textContent = `You cracked the code!`;

    const info = createEl('div', { className: 'win-info' });

    const infoBlock1 = createEl('div', { className: 'win-info-item' });
    const span11 = createEl('span', { className: 'modal-text-lg', textContent: `${tries}` });
    const span12 = createEl('span', { className: '', textContent: 'Tries' });
    infoBlock1.append(span11, span12);

    const infoBlock2 = createEl('div', { className: 'win-info-item' });
    const span21 = createEl('span', { className: 'modal-text-lg', textContent: `${time}` });
    const span22 = createEl('span', { className: '', textContent: 'Time' });
    infoBlock2.append(span21, span22);

    info.append(infoBlock1, infoBlock2);

    const modal = createModal([header, text, info]);

    modal.addEventListener('close', stop);

    return modal;
};
