import { createEl } from '../../helpers';
import { formatTime } from '../../helpers';

export const Timer = () => {
    const container = createEl('div', { className: 'timer' });
    const img = createEl('img', { src: './images/timer.svg', className: '' });
    const label = createEl('div');
    const display = createEl('div', { textContent: '00:00' });

    label.append(img);
    container.append(label, display);

    let startedAt: number | null = null;
    let secondsElapsed = 0;
    let timerInterval: number | null = null;

    const getElapsedSeconds = (): number => {
        return startedAt === null ? secondsElapsed : Math.floor((Date.now() - startedAt) / 1000);
    };

    const stop = (): void => {
        secondsElapsed = getElapsedSeconds();
        startedAt = null;

        if (timerInterval !== null) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        display.textContent = formatTime(secondsElapsed);
    };

    const start = (): void => {
        stop();

        secondsElapsed = 0;
        startedAt = Date.now();

        display.textContent = formatTime(0);

        timerInterval = window.setInterval(() => {
            display.textContent = formatTime(getElapsedSeconds());
        }, 1000);
    };

    return {
        element: container,
        start,
        stop,
        getElapsedSeconds: () => secondsElapsed,
    };
};
