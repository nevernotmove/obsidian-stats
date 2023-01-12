<script lang="ts">
    import pluginDownloadsOverTime from './pluginDownloadsOverTime';
    import {onMount} from "svelte";
    import type {ChartDefaults} from '../ChartDefaults';
    import {getData} from '../../cache';
    import {Chart} from 'chart.js';
    import SearchBar from './SearchBar.svelte';

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
                chart = pluginDownloadsOverTime(data, pluginName, chartDefaults);
            } else {
                error = true;
            }
        });
    }
</script>

<div class="container">
    <SearchBar {plugins} {searchText} onSearch={(s) => loadData(s)} {error}/>
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
    .chart-container {
        height: 100%;
    }
</style>
