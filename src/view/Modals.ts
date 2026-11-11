import { createEl, formatTime } from './../helpers';

import { state } from '../state/state';
import { BASES_CONFIG, type BaseKey } from '../state/stateConfig';
import createResultTable, { type LeaderboardData } from './components/ResultTable';
import createModal from './components/Modal';

// import { createFireworks } from './fireworks';
type Game = {
    tries: number;
    date: number;
    time: number; // elapsed seconds
    base: BaseKey;
    length: number;
};

type BestGames = Partial<Record<BaseKey, Game[]>>;

const STORAGE_KEY = 'bulls-and-cows-bestgames';

const getBestGames = (): BestGames => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};

    try {
        const parsed: unknown = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            return parsed as BestGames;
        }
    } catch {
        console.warn('Cannot parse leaderboard data from localStorage');
    }

    return {};
};

const prepareResults = (bestGames: BestGames): LeaderboardData => {
    const result: LeaderboardData = {};

    (Object.keys(BASES_CONFIG) as BaseKey[]).forEach((base) => {
        const games = bestGames[base];
        result[base] = (Array.isArray(games) ? games : []).map((game) => ({
            tries: String(game.tries),
            time: formatTime(game.time),
            length: String(game.length),
            date: new Date(game.date).toLocaleDateString('en-GB'),
        }));
    });

    return result;
};

export const createLeaderBoard = () => {
    const results = prepareResults(getBestGames());
    const content = createResultTable(results, state.currentBase);

    return createModal([content]);
};

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
