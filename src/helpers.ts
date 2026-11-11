export const createEl = <K extends keyof HTMLElementTagNameMap>(
    el: K,
    props: Partial<HTMLElementTagNameMap[K]> = {},
): HTMLElementTagNameMap[K] => Object.assign(document.createElement(el), props);

export const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const minutes = mins.toString().padStart(2, '0');
    const secondsFormatted = secs.toString().padStart(2, '0');

    return hours > 0 ? `${hours}:${minutes}:${secondsFormatted}` : `${minutes}:${secondsFormatted}`;
};
