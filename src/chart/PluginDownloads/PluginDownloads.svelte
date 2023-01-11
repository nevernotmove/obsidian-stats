<script lang="ts">
    import pluginDownloadsOverTime from './pluginDownloadsOverTime';
    import {onMount} from "svelte";
    import type {ChartDefaults} from '../ChartDefaults';
    import {getData} from '../../cache';

    export let chartDefaults: ChartDefaults;
    let error = false;

    onMount(() => {
        const lastSegment = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        console.log(lastSegment);
        const pluginName = lastSegment === 'plugin-downloads' ? 'chord-lyrics' : lastSegment;
        console.log(pluginName);
        const path = `plugins/${pluginName}.json`;
        getData(path, (data: object) => {
            data ? pluginDownloadsOverTime(data, pluginName, chartDefaults) : error = true;
        });
    });
</script>

<div>
    {#if error}
        <span>The requested plugin does not exist</span>
    {:else}
        <canvas id="chart"></canvas>
    {/if}   
</div>

<style>
    div {
        display: flex;
        height: 100%;
    }
    span {
        padding: 1%;
        margin: auto;
        background-color: var(--color1); 
    }
</style>
