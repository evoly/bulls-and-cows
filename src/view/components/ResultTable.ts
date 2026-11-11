import { BASES_CONFIG, type BaseKey } from '../../state/stateConfig';

export type LeaderboardRow = {
    tries: string;
    time: string;
    length: string;
    date: string;
};

export type LeaderboardData = Partial<Record<BaseKey, LeaderboardRow[]>>;

const TABLE_HEADERS = ['#', 'Tries', 'Time', 'Length', 'Date'];

const createTable = (rows: LeaderboardRow[]): HTMLTableElement => {
    const table = document.createElement('table');
    table.className = 'table';

    const headerRow = table.createTHead().insertRow();
    TABLE_HEADERS.forEach((heading) => {
        const th = document.createElement('th');
        th.textContent = heading;
        headerRow.append(th);
    });

    const body = table.createTBody();
    if (rows.length === 0) {
        const cell = body.insertRow().insertCell();
        cell.colSpan = TABLE_HEADERS.length;
        cell.textContent = 'No results yet';
        return table;
    }

    rows.forEach((result, index) => {
        const row = body.insertRow();
        const values = [String(index + 1), result.tries, result.time, result.length, result.date];

        values.forEach((value) => {
            row.insertCell().textContent = value;
        });
    });

    return table;
};

const createResultTable = (results: LeaderboardData, initialBase: BaseKey): HTMLElement => {
    console.log('results', results);
    const container = document.createElement('section');
    container.className = 'results';

    const tabs = document.createElement('div');
    tabs.className = 'results-tabs';
    tabs.setAttribute('role', 'group');
    tabs.setAttribute('aria-label', 'Number system');

    const tableContainer = document.createElement('div');
    tableContainer.className = 'results-table-container';

    let selectedBase = initialBase;
    const buttons = new Map<BaseKey, HTMLButtonElement>();

    const render = (): void => {
        buttons.forEach((button, base) => {
            const isSelected = base === selectedBase;
            button.classList.toggle('active', isSelected);
            button.setAttribute('aria-pressed', String(isSelected));
        });

        tableContainer.replaceChildren(createTable(results[selectedBase] ?? []));
    };

    (Object.keys(BASES_CONFIG) as BaseKey[]).forEach((base) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'results-tab';
        button.textContent = base.toUpperCase();

        button.addEventListener('click', () => {
            selectedBase = base;
            render();
        });

        buttons.set(base, button);
        tabs.append(button);
    });

    container.append(tabs, tableContainer);
    render();

    return container;
};

export default createResultTable;
