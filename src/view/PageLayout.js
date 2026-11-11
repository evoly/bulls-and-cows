import { createEl } from './../helpers';

import { LeaderboardButton, GameActionButton } from './components/Buttons';
import { GuessForm } from './GuessForm';
import { Options } from './components/Options';
import { createHistoryCards } from './components/createHistoryCards';
import { Timer } from './components/Timer';

import { generateSecret } from '../logic/generateSecret';

import { state } from '../state/state';

const timer = Timer();

const gameInfo = () => {
    const gameInfo = createEl('div', { className: 'game-info hidden' });
    const hint = createEl('div', { className: 'game-info-item' });
    const span1 = createEl('span', { className: '', textContent: ' 🐂 - right place;' });
    const span2 = createEl('span', { className: '', textContent: '🐄 - wrong place' });
    hint.append(span1, span2);

    gameInfo.append(hint);
    return gameInfo;
};

const Header = ({ onShowLeaderboard }) => {
    const header = createEl('header', { className: 'header container' });
    header.append(LeaderboardButton(onShowLeaderboard));

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

    const info = gameInfo();

    const handleStartGame = () => {
        if (!(state.gameStatus === 'ready')) return;
        console.log(state);
        state.secret = generateSecret(state.guessLength, state.currentBase);

        state.guess = [];
        state.history = [];
        state.tries = 0;
        state.gameStatus = 'playing';

        options.setStarted(state.gameStatus === 'ready');
        guessForm.update();

        timer.start();

        setTimeout(() => {
            startButton.classList.add('hidden');
            info.classList.remove('hidden');
            updateActionButtons();

            //add giveup bitton to gameBoard here

            // behavior: fill inputBoxes, set gamestatus 'gaveUp' add new game button to gamedoard
        }, 1200);
    };

    const handleGiveUp = () => {
        if (state.gameStatus !== 'playing') return;

        state.gameStatus = 'gaveUp';
        timer.stop();

        guessForm.revealSecret();
        updateActionButtons();
    };

    const handleNewGame = () => {
        state.guess = [];
        state.history = [];
        state.tries = 0;
        state.gameStatus = 'ready';
        state.secret = [];

        options.setStarted(state.gameStatus === 'ready');

        startButton.classList.remove('hidden');
        info.classList.add('hidden');

        guessForm.update();

        console.log('state new g', state);
    };
    const startButton = GameActionButton('ready', handleStartGame, 'btn-start');

    const giveUpButton = GameActionButton('playing', handleGiveUp);
    const newGameButton = GameActionButton('gaveUp', handleNewGame);

    const gameActions = createEl('div', { className: 'game-actions' });
    gameActions.append(giveUpButton, newGameButton);

    info.prepend(timer.element);

    const updateActionButtons = () => {
        giveUpButton.classList.toggle('hidden', state.gameStatus !== 'playing');

        newGameButton.classList.toggle('hidden', state.gameStatus !== 'won' && state.gameStatus !== 'gaveUp');
    };

    updateActionButtons();

    const guessForm = GuessForm({ onHistoryChange: updateHistory, onWin: updateActionButtons, timer: timer });
    const options = Options({ onChange: () => guessForm.update() }, startButton, info);

    gameBoard.append(historyContainer, guessForm.container, gameActions);
    main.append(title, descr1, descr2, options.container, gameBoard);
    return main;
};

export default () => {
    return [
        Header({
            onShowLeaderboard: () => {},
        }),
        mainContent(),
    ];
};
