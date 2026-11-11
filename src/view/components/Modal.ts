import { createEl } from '../../helpers';
import { CloseButton } from './Buttons';

const createModal = (content: HTMLElement[]) => {
    const modal = createEl('dialog', { className: 'modal overlay' });
    const modalInner = createEl('div', { className: 'modal-inner' });
    const modalContent = createEl('div', { className: 'modal-content' });
    const modalFooter = createEl('div', { className: 'modal-footer' });

    const closeModal = CloseButton(() => modal.close());

    modalContent.append(...content);
    // modalFooter.append() new game
    modalInner.append(closeModal, modalContent, modalFooter);
    modal.append(modalInner);

    const body = document.querySelector('body');
    if (!body) throw new Error('No <body> element found');
    body.append(modal);

    modal.addEventListener('click', ({ target }) => {
        if (target === modal) {
            modal.close();
        }
    });
    modal.addEventListener('close', () => modal.remove());

    modal.showModal();
    return modal;
};

export default createModal;
