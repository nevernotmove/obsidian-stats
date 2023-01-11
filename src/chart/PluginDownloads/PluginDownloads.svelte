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

<div>
    <form on:submit|preventDefault={onSubmit}>
        <input type="text" bind:value={searchText} placeholder="Enter plugin name">
    </form>
    {#if error}
        <span>The requested plugin does not exist</span>
    {/if}
    <canvas id="chart"></canvas>
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    form {
        margin: auto;
    }
    span {
        padding: 1%;
        margin: auto;
        background-color: var(--color1); 
    }
</style>
