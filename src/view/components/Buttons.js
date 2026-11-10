import { createEl } from '../../helpers';

const Button = ({ classes, text, onClick }) => {
    const button = createEl('button', { className: `btn ${classes}`, type: 'button' });
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
};

export default Button;

export const StartGameButton = (onStartGame) => Button({ classes: 'btn', text: 'Start Game', onClick: onStartGame });

export const NewGameButton = (onNewGame) => Button({ classes: 'btn', text: 'New Game', onClick: onNewGame });

export const LeaderboardButton = (onSwowModal) => Button({ classes: 'btn', text: 'Leaderboard', onClick: onSwowModal });

export const CloseButton = (onClose) => Button({ classes: 'btn', text: 'Close', onClick: onClose });
