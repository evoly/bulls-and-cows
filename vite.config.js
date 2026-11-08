import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
process.env.BROWSER = 'google-chrome';

export default defineConfig({
    plugins: [
        checker({
            // Включаем встроенную проверку TypeScript
            typescript: {
                // Указываем использовать тот же бинарник, что и для тайпчека
                tscCommand: './node_modules/.bin/tsc6',
            },
        }),
    ],
    server: {
        open: true,
    },
    base: '/bulls-and-cows/',
});
