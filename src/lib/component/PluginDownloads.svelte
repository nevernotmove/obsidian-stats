<script lang='ts'>
    import { Chart } from 'chart.js';
    import { onDestroy, onMount } from 'svelte';
    import { randomId } from '../util/util';
    import { getData } from '../util/cache';
    import Nav from './Nav.svelte';
    import lineChart from '../util/chart/lineChart';

    const id = randomId();
    let pluginData: object;
    let chart: Chart;
    let loading = false;
    let error = false;
    export let activePlugin: string = null;
    $: if (activePlugin !== null) {
        load(activePlugin);
    }

    $: if (pluginData) {
        if (chart) chart.destroy();
        const targetEl = document.getElementById(id) as HTMLCanvasElement;
        if (targetEl) chart = lineChart(pluginData, targetEl);
    }

    onMount(() => {
        load(activePlugin);
    });

    onDestroy(() => {
        if (chart) chart.destroy();
    });

    function load(pluginName: string) {
        if (loading) return;
        error = false;
        loading = true;
        const path = `plugins/${pluginName}.json`;
        getData(path, (data: object) => {
            if (data) {
                pluginData = data;
            } else {
                error = true;
            }
            loading = false;
        });
    }
</script>

<Nav />
<div>
    {#if error}
        <div id='error-container'>
            <span id='error'>Plugin {activePlugin} does not exist</span>
        </div>
    {:else}
        <canvas {id} />
    {/if}
</div>

<style>
    div {
        height: 100%;
    }
    
    #error-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    #error {
        color: var(--color-error);
        font-size: 1.5em;
        text-align: center;
    }
</style>
