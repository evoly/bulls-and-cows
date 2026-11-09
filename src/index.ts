import './css/main.css';

import App from './view/PageLayout';

const root = document.getElementById('root');

if (!root) {
    throw new Error('Root element not found');
}

root.append(...App());
