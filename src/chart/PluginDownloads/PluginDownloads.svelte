<script lang="ts">
    import pluginDownloadsOverTime from './pluginDownloadsOverTime';
    import {onMount} from "svelte";
    import type {ChartDefaults} from '../ChartDefaults';
    import {getData} from '../../cache';
    import {Chart} from 'chart.js';

    export let chartDefaults: ChartDefaults;
    let searchText: string;
    let plugins: object;
    let error: boolean = false;
    let chart: Chart;

    onMount(() => {
        getData('total-downloads.json', (data: object) => {
            if (data) plugins = data;
        });
        const lastSegment = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        let pluginName = 'chord-lyrics';
        if (lastSegment !== 'plugin-downloads') {
            pluginName = lastSegment;
            searchText = pluginName;
        }
        loadData(pluginName);
    });

    function loadData(pluginName: string) {
        const path = `plugins/${pluginName}.json`;
        getData(path, (data: object) => {
            if (data) {
                if (chart) chart.destroy();
                error = false;
                chart = pluginDownloadsOverTime(data, pluginName, chartDefaults);
            } else {
                error = true;
            }
        });
    }

    function search() {
        searchText = searchText.trim();
        if (searchText === '') return;
        let pluginExists = false;
        for (const pluginName of Object.keys(plugins)) {
            if (pluginName === searchText) {
                pluginExists = true;
                break;
            }
        }
        if (pluginExists) loadData(searchText);
        else error = true;
    }

    function onInput() {
        error = false;
        if (searchText === '') return;
        const suggestions: string[] = [];
        for (const pluginName: string of Object.keys(plugins)) {
            //if (pluginName.startsWith(searchText)) {
            if (fuzzySearch(searchText, pluginName)) {
                suggestions.push(pluginName);
            }
        }
        console.log(suggestions);
    }

    function fuzzySearch(search: string, text: string): boolean {
        const searchLen = search.length;
        const textLen = text.length;
        if (searchLen > textLen) return false;
        if (searchLen === textLen) return search === text;
        nextChar: for (let s = 0, t = 0; s < searchLen; s++) {
            let searchChart = search.charCodeAt(s);
            while (t < textLen) {
                if (text.charCodeAt(t++) === searchChart) {
                    continue nextChar;
                }
            }
            return false;
        }
        return true;
    }
</script>

<div class="container">
    <form on:submit|preventDefault={search}>
        <input autofocus type="text" bind:value={searchText} on:input={onInput} placeholder="Enter plugin name" class:error={error}>
    </form>
    <div class="chart-container">
        <canvas id="chart"></canvas>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    form {
        padding: .5%;
        margin: auto auto .5% auto;
    }

    input {
        background-color: var(--color2);
        color: var(--color1);
        padding: .3em .6em;
        border-color: var(--color2);
        border: 1px inset var(--color1);
        border-radius: var(--radius);
    }

    .error {
        background-color: var(--color-error);
    }

    .chart-container {
        height: 100%;
    }
</style>
