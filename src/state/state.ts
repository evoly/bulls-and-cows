import type { BaseKey } from './stateConfig';
import { GameStatus } from './stateConfig';

type GuessResult = {
    guess: string[];
    bulls: number;
    cows: number;
};

type GameState = {
    gameStatus: GameStatus;
    currentBase: BaseKey;
    guess: string[];
    history: GuessResult[];
    tries: number;
    guessLength: number;
    secret: string[];
};

export let state: GameState = {
    gameStatus: 'ready',
    currentBase: 'hex',
    guess: [],
    secret: [],
    history: [],
    tries: 0,
    guessLength: 4,
};

export const updateState = (updates: Partial<GameState>): void => {
    state = { ...state, ...updates };
};
