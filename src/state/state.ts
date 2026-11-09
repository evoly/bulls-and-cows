import type { BaseKey } from './stateConfig';

type GuessResult = {
    guess: string[];
    bulls: number;
    cows: number;
};

type GameState = {
    isStarted: boolean;
    currentBase: BaseKey;
    guess: string[];
    history: GuessResult[];
    tries: number;
    guessLength: number;
    secret: string[];
};

export const state: GameState = {
    isStarted: false,
    currentBase: 'hex',
    guess: [],
    secret: [],
    history: [],
    tries: 0,
    guessLength: 4,
};
