import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default ({ command }) => {
    let basepath = '/';
    if (command === 'build') basepath = '/plugin-stats';

    return defineConfig({
        base: basepath, // Base URL of website
        plugins: [svelte()]
    });
};
