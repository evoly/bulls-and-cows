# Bulls and Cows — Design Notes

## 1. Architecture

The project separates the game rules from browser-specific code:

- `src/logic/` contains the algorithms for secret generation, guess evaluation, validation, and counting possible secrets. These functions do not access the DOM or `localStorage`.
- `src/state/state.ts` defines the game state; `src/state/stateConfig.ts` defines the supported number systems and game statuses.
- `src/view/` handles player input, the game lifecycle, and dialogs. Components in `src/view/components/` render options, history, the keyboard, the timer, and leaderboard tables.
- `tests/` contains Vitest tests for each of the five required logic functions.

The UI calls the logic functions and handles side effects (rendering, timer updates, and persistence). This keeps the core rules testable without a browser.

## 2. Data structures

### Game state and guess history

`src/state/state.ts` defines a `GameState` object containing:

| Field         | Type                                        | Purpose                                                 |
| ------------- | ------------------------------------------- | ------------------------------------------------------- |
| `gameStatus`  | `'ready' \| 'playing' \| 'won' \| 'gaveUp'` | Controls the current stage of the game.                 |
| `currentBase` | `BaseKey`                                   | Selected number system (`bin`, `oct`, `dec`, or `hex`). |
| `guessLength` | `number`                                    | Required number of digits.                              |
| `secret`      | `string[]`                                  | The hidden sequence of digits.                          |
| `guess`       | `string[]`                                  | The player's current input.                             |
| `history`     | `GuessResult[]`                             | Previous evaluated guesses.                             |
| `tries`       | `number`                                    | Number of submitted valid attempts.                     |

Both `secret` and `guess` are **arrays of strings**, not numbers. This preserves leading zeroes (for example, `['0', '1', '2', '3']`), supports hexadecimal letters, and makes the position of each digit explicit.

Each history entry has the shape `{ guess: string[], bulls: number, cows: number }`. An **array of objects** is suitable because guesses are shown in chronological order, and each entry keeps the submitted digits and their feedback together. On unsuccessful guesses, `GuessForm` creates a new history array rather than calling `push`:

```ts
state.history = [...history, { guess, bulls, cows }];
```

Current input is also updated by creating a new array (`[...guess, digit]` or `guess.slice(0, -1)`). The **arrays are updated immutably**, although the containing `state` object is mutable and its properties are reassigned.

`BASES_CONFIG` in `src/state/stateConfig.ts` is a `Record<BaseKey, BaseConfig>`. It provides the radix, label, and valid digit alphabet in one place for the UI.

### Leaderboard and memoization

The leaderboard is persisted in `localStorage` under `bulls-and-cows-bestgames`. Its structure is equivalent to:

```ts
type Game = {
    tries: number;
    time: number; // elapsed seconds
    date: number; // timestamp
    base: string;
    length: number;
};

type BestGames = Partial<Record<BaseKey, Game[]>>;
```

Results are grouped by number system, so updating one base does not replace results from other bases. Each group's results are sorted first by `tries` and then by `time`, and only the best ten are retained. The `length` field is stored and displayed so that differently configured games remain identifiable. `src/view/Modals.ts` reads and formats stored data; `src/view/components/ResultTable.ts` renders the table and base filters.

`countPossibleSecrets` uses a module-level `Map<string, number>` as a memoization cache, keyed by the pair `length-base`. `Map` provides efficient expected-time lookups and avoids repeating recursive calculations for settings already requested.

## 3. Algorithms

### `generateSecret(length, base, random = Math.random)`

**File:** `src/logic/generateSecret.ts`

1. Select the digit alphabet for the requested base.
2. Copy the alphabet so the original array is not modified.
3. Shuffle the copy with the **Fisher–Yates algorithm**, choosing an index through the injected `random` function.
4. Return the first `length` digits.

Shuffling a list of unique digits and taking a prefix guarantees no duplicates; zero is allowed in the first position. The options UI restricts `length` so it does not exceed the size of the selected alphabet. Passing `random` as an argument makes tests reproducible when they provide a deterministic source of random values.

### `evaluateGuess(secret, guess)`

**File:** `src/logic/evaluateGuess.ts`

The function first normalizes both arrays with `toLowerCase()`, so hexadecimal `A` and `a` compare equally.

- A **bull** is a digit matching the secret at the same index. It is counted with `filter((digit, index) => digit === normalizedGuess[index])`.
- A **cow** is a digit present in the guess but at a different index. It is counted with a second `filter` that checks both the index mismatch and `normalizedGuess.includes(digit)`.

For example, with secret `['0', 'a', 'b', '3']` and guess `['a', '0', 'b', 'f']`, the result is `{ bulls: 1, cows: 2 }`.

The implementation uses array methods instead of manually maintained counters. Its rules assume the input is a valid guess with no repeated digits; that property is enforced by `isValidGuess` before evaluation in the game form.

### `isValidGuess(guess, length, base)` and `createDigitValidator(base)`

**Files:** `src/logic/isValidGuess.ts` and `src/logic/createDigitValidator.ts`

Validation uses early returns: reject a guess of the wrong length, use `every(createDigitValidator(base))` to reject characters outside the base, then compare the size of a `Set` of lowercased digits with the requested length. The `Set` detects duplicates, including case-insensitive duplicates such as `a` and `A`.

`createDigitValidator` is a curried factory returning a predicate for a selected radix. That same predicate is used during keyboard input in `src/view/GuessForm.ts` and during final guess validation, preventing two separate implementations of the allowed-digit rule.

### `countPossibleSecrets(length, base)`

**File:** `src/logic/countPossibleSecrets.ts`

Secrets contain distinct digits, and the first digit may be zero. Therefore, the number of possible secrets is the number of ordered selections without replacement:

$$
P(b, n) = \frac{b!}{(b-n)!} = b \times (b-1) \times \dots \times (b-n+1)
$$

The implementation uses the recurrence:

```text
countPossibleSecrets(n, b) = b * countPossibleSecrets(n - 1, b - 1)
countPossibleSecrets(0, b) = 1
countPossibleSecrets(n, b) = 0, when n > b
```

For instance, a four-digit decimal code has `10 × 9 × 8 × 7 = 5,040` possibilities. Each computed pair is stored in the `Map` cache. On a later call with the same pair, the cached number is returned without repeating the recursion. The function is deterministic from the caller's perspective, but memoization introduces an internal cache mutation.

## 4. Time and space complexity (Big O)

Let **b** be the number of symbols in the chosen number system and **n** be the secret or guess length. `Map` and `Set` operations are assumed to have expected O(1) lookup/insertion time.

| Function               | Time                                             | Auxiliary space     | Reason                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `generateSecret`       | **O(b + n)**                                     | **O(b + n)**        | Copies and shuffles all `b` allowed digits, then creates a sliced result of length `n`. Since `n ≤ b`, this simplifies to O(b).                                                |
| `evaluateGuess`        | **O(n²)**                                        | **O(n)**            | Two `map` calls and the bull check are linear. The cow check calls `includes` (up to O(n)) for up to `n` digits, dominating the runtime. Normalized arrays require O(n) space. |
| `isValidGuess`         | **O(n)** expected                                | **O(n)**            | `every`, lowercase normalization, and creation of the uniqueness `Set` each scan at most `n` digits.                                                                           |
| `countPossibleSecrets` | **O(n)** first uncached call; **O(1)** cache hit | **O(n)** first call | Recursion decreases `n` once per level. The first call stores up to `n` results and uses an O(n) call stack; later calls for a cached pair only perform a `Map` lookup.        |

In this application, the available bases are fixed at 2, 8, 10, and 16, and lengths are 2–6. These are small, bounded inputs; the Big O expressions above describe how the algorithms would scale if the bounds were increased.

## 5. Clean Code principles applied

| Principle                                  | Where and how                                                                                                                                                                                                                           |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Meaningful names**                       | `evaluateGuess`, `createDigitValidator`, `countPossibleSecrets`, `handleInput`, and `handleBackspace` indicate what each function does. `bulls`, `cows`, `guessLength`, and `currentBase` describe their data without needing comments. |
| **Single Responsibility Principle**        | The files in `src/logic/` each handle a specific game rule. `createHistoryCards` renders history entries, while `ResultTable.ts` handles leaderboard display.                                                                           |
| **Separation of concerns**                 | Functions in `src/logic/` have no DOM or storage dependencies. `GuessForm.ts` connects input events to validation/evaluation; `Modals.ts` handles leaderboard data preparation; UI components generate markup.                          |
| **Don't Repeat Yourself (DRY)**            | `createDigitValidator` supplies the digit rule to both `isValidGuess` and live input handling. `BASES_CONFIG` centralizes the available number systems; `createEl` in `src/helpers.ts` centralizes typed DOM element creation.          |
| **Dependency injection and testability**   | `generateSecret` receives `random` as a parameter instead of hardcoding its source, allowing deterministic unit tests.                                                                                                                  |
| **Guard clauses**                          | `isValidGuess` exits early on incorrect length or invalid characters; `handleInput` returns when a character is invalid, repeated, or exceeds the chosen length. This avoids unnecessary nesting.                                       |
| **Explicit types**                         | `GameState`, `GuessResult`, `BaseKey`, and `GameStatus` make the expected shape of state and valid status values clear in TypeScript.                                                                                                   |
| **Prefer non-mutating collection updates** | `GuessForm.ts` replaces `guess` and `history` arrays rather than modifying those arrays with `push` or `pop`.                                                                                                                           |

## 6. Testing approach

Vitest unit tests in `tests/` exercise each required logic function separately. Tests for `generateSecret` pass controlled random values to avoid nondeterministic outcomes. Other tests cover scoring, hexadecimal case handling, allowed digits, unique digits, and permutation counts. The required algorithms were developed using separate tests-first and implementation commits (TDD).

The core logic is kept outside UI code so these tests can run in Node without constructing DOM elements or relying on browser storage.
