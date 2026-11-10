import { createEl } from './../helpers';

import { NewGameButton, LeaderboardButton, StartGameButton } from './components/Buttons';
import { GuessForm } from './GuessForm';
import { Options } from './components/Options';
import { createHistoryCards } from './components/createHistoryCards';

import { generateSecret } from '../logic/generateSecret';

import { state } from '../state/state';

const gameInfo = () => {
    const line = createEl('div', { className: 'game-info' });
    const hint = createEl('div', { className: 'game-info-item' });
    const span1 = createEl('span', { className: '', textContent: ' 🐂 - right place;' });
    const span2 = createEl('span', { className: '', textContent: '🐄 - wrong place' });
    hint.append(span1, span2);
    line.append(hint);

    return line;
};

const Header = ({ onNewGame, onShowLeaderboard }) => {
    const header = createEl('header', { className: 'header container' });
    header.append(NewGameButton(onNewGame), LeaderboardButton(onShowLeaderboard));

    return header;
};

const mainContent = () => {
    const main = createEl('main', { className: 'container main' });
    const title = createEl('div', { className: 'title' });
    const img = createEl('img', { src: './images/bulls-and-cows-logo.svg', className: 'title-img' });
    const h1 = createEl('h1');
    h1.textContent = 'Welcome to Bulls and Cows!';
    title.append(img, h1);

    const descr1 = createEl('p', { className: 'sub-title' });
    descr1.textContent = 'Crack the secret code.';
    const descr2 = createEl('p', { className: 'sub-title' });
    descr2.textContent =
        'Each guess reveals how many symbols are in the right position and how many are correct but misplaced.';

    const gameBoard = createEl('section', { className: 'game-board' });

    const historyContainer = createEl('section', { className: 'history' });

    const updateHistory = () => {
        historyContainer.replaceChildren(...createHistoryCards(state.history));
    };

    const guessForm = GuessForm({ onHistoryChange: updateHistory });
    const options = Options({ onChange: () => guessForm.update() });

    const handleStartGame = () => {
        if (state.isStarted) return;
        console.log(state);
        state.secret = generateSecret(state.guessLength, state.currentBase);

        state.guess = [];
        state.history = [];
        state.tries = 0;
        state.isStarted = true;

        options.setStarted(state.isStarted);
        guessForm.update();

        gameBoard.prepend(gameInfo());
        startButton.classList.add('animate');

        setTimeout(() => {
            startButton.classList.add('hidden');
        }, 1200);
    };

    const startButton = StartGameButton(handleStartGame);

    gameBoard.append(historyContainer, guessForm.container, startButton);
    main.append(title, descr1, descr2, options.container, gameBoard);
    return main;
};

export default () => {
    return [
        Header({
            onNewGame: () => {},
            onShowLeaderboard: () => {},
        }),
        mainContent(),
    ];
};
