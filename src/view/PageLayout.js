import { createEl } from './../helpers';
import { NewGameButton, LeaderboardButton } from './components/Buttons';
import { GuessForm } from './GuessForm';
import { Options } from './components/Options';
// import { state } from '../state/state';

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

    const guessForm = GuessForm();
    const options = Options({ onChange: () => guessForm.update() });

    main.append(title, descr1, descr2);
    main.append(options.container, guessForm.container);

    /*
    state.isStarted = true;
    options.setStarted(state.isStarted);
*/
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
