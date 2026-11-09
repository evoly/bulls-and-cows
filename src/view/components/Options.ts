import { createEl } from '../../helpers';
import { BASES_CONFIG } from '../../state/stateConfig';
import { BaseKey } from '../../state/stateConfig';
import { state } from '../../state/state';

type OptionsProps = { onChange?: () => void };

const MIN_LENGTH = 2;
const MAX_LENGTH = 6;
const lengthOptions = Array.from({ length: MAX_LENGTH - MIN_LENGTH + 1 }, (_, index) => MIN_LENGTH + index);
const isLengthAllowed = (length: number, base: BaseKey) => length <= BASES_CONFIG[base].value;

export const Options = ({ onChange }: OptionsProps = {}) => {
    const bases = Object.keys(BASES_CONFIG);
    const { guessLength, currentBase } = state;

    const container = createEl('section', { className: 'options' });

    const h2 = createEl('h2', { textContent: 'Choose options', className: 'options-header' });

    const fieldsetBase = createEl('fieldset', { className: 'options-fieldset' });
    const legendBase = createEl('legend', { textContent: 'Choose base', className: 'visually-hidden' });
    const fakeLegendBase = createEl('div', { className: 'options-legend', textContent: 'Choose base:' });
    fakeLegendBase.ariaHidden = 'true';

    const baseSelector = createEl('div', { className: 'options-group' });

    const baseButtons = bases.map((item) => {
        const radioButton = createEl('input', {
            type: 'radio',
            name: 'bases',
            value: item,
            className: 'options-button visually-hidden',
            checked: item === currentBase,
        });

        const label = createEl('label');
        const span = createEl('span', { textContent: item, className: 'options-item' });
        label.append(radioButton, span);

        return label;
    });

    baseSelector.append(...baseButtons);
    fieldsetBase.append(legendBase, fakeLegendBase, baseSelector);

    const fieldsetLength = createEl('fieldset', { className: 'options-fieldset' });
    const legendLength = createEl('legend', { textContent: 'Choose length', className: 'visually-hidden' });
    const fakeLegendLength = createEl('div', { className: 'options-legend', textContent: 'Choose length:' });
    fakeLegendLength.ariaHidden = 'true';

    const lengthSelector = createEl('div', { className: 'options-group' });

    const lengthInputs: HTMLInputElement[] = [];

    const lengthButtons = lengthOptions.map((item) => {
        const radioButton = createEl('input', {
            type: 'radio',
            name: 'length',
            value: `${item}`,
            className: 'options-button visually-hidden',
            checked: item === guessLength,
            disabled: !isLengthAllowed(item, currentBase),
        });
        lengthInputs.push(radioButton);
        const label = createEl('label');
        const span = createEl('span', { textContent: `${item}`, className: 'options-item' });
        label.append(radioButton, span);

        return label;
    });

    lengthSelector.append(...lengthButtons);
    fieldsetLength.append(legendLength, fakeLegendLength, lengthSelector);

    container.append(h2, fieldsetBase, fieldsetLength);
    container.addEventListener('change', (event) => {
        const target = event.target;

        if (!(target instanceof HTMLInputElement)) return;

        if (target.name === 'bases') {
            const selectedBase = target.value as BaseKey;

            lengthInputs.forEach((input) => {
                input.disabled = !isLengthAllowed(Number(input.value), selectedBase);
            });

            if (!isLengthAllowed(state.guessLength, selectedBase)) {
                state.guessLength = MIN_LENGTH;

                const minLengthInput = lengthInputs.find((input) => Number(input.value) === MIN_LENGTH);

                if (minLengthInput) minLengthInput.checked = true;
            }

            state.currentBase = selectedBase;
        }

        if (target.name === 'length') {
            state.guessLength = Number(target.value);
        }
        onChange?.();
        console.log('state', state);
    });

    const setStarted = (isStarted: boolean) => {
        fieldsetBase.disabled = isStarted;
        fieldsetLength.disabled = isStarted;

        h2.textContent = isStarted ? 'Game options' : 'Choose options';
    };

    setStarted(state.isStarted);

    return { container, setStarted };
};
