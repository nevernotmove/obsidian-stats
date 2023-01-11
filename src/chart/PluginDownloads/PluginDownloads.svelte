<script lang="ts">
    import pluginDownloadsOverTime from './pluginDownloadsOverTime';
    import {onMount} from "svelte";
    import type {ChartDefaults} from '../ChartDefaults';
    import {getData} from '../../cache';
    import {Chart} from 'chart.js';

    export let chartDefaults: ChartDefaults;
    let searchText: string;
    let error: boolean = false;
    let chart: Chart;

    onMount(() => {
        const lastSegment = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        const pluginName = lastSegment === 'plugin-downloads' ? 'chord-lyrics' : lastSegment;
        loadData(pluginName);
    });

    function loadData(pluginName: string) {
        const path = `plugins/${pluginName}.json`;
        console.log('Will request', path);
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

    function onSubmit() {
        loadData(searchText);
    }
</script>

<div class="container">
    <form on:submit|preventDefault={onSubmit}>
        <input autofocus type="text" bind:value={searchText} placeholder="Enter plugin name" class:error={error}>
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
