import { GameStatus } from '../../state/stateConfig';

type ButtonProps = {
    classes?: string;
    text: string;
    onClick: () => void;
};

const buttonText: Record<GameStatus, string> = {
    ready: 'Start Game',
    playing: 'Give Up',
    won: 'New Game',
    gaveUp: 'New Game',
};

const Button = ({ classes = '', text, onClick }: ButtonProps): HTMLButtonElement => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = `btn ${classes}`.trim();
    button.textContent = text;
    button.addEventListener('click', onClick);

    return button;
};

export const GameActionButton = (status: GameStatus, onClick: () => void, classes: string = 'btn'): HTMLButtonElement =>
    Button({ text: buttonText[status], onClick, classes });

export const StartGameButton = (onStartGame: () => void): HTMLButtonElement =>
    Button({ text: buttonText.ready, onClick: onStartGame });

export const GiveUpButton = (onGiveUp: () => void): HTMLButtonElement =>
    Button({ text: buttonText.gaveUp, onClick: onGiveUp });

export const NewGameButton = (onNewGame: () => void): HTMLButtonElement =>
    Button({ text: buttonText.won, onClick: onNewGame });

export const CloseButton = (): HTMLButtonElement => Button({ text: 'Close', onClick: () => {} });

export const LeaderboardButton = () => Button({ classes: 'btn btn-lg', text: 'LeaderBoard', onClick: () => {} });

/*
export const GameActionButton = (
    status: GameStatus,
    onClick: () => void
): HTMLButtonElement => {
    return Button({ text: BUTTON_TEXT[status], onClick });
};

*/
