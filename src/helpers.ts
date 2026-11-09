export const createEl = <K extends keyof HTMLElementTagNameMap>(
    el: K,
    props: Partial<HTMLElementTagNameMap[K]> = {},
): HTMLElementTagNameMap[K] => Object.assign(document.createElement(el), props);
