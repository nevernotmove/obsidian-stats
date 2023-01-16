<script lang="ts">
    import {Chart} from 'chart.js';
    import {onDestroy, onMount} from 'svelte';
    import {randomId} from '../util/util';
    import {getData} from '../util/cache';
    import Nav from './Nav.svelte';
    import lineChart from '../util/chart/lineChart';

    const id = randomId();
    let pluginData: object;
    let chart: Chart;
    let loading = false;
    export let activePlugin: string = null;
    $: if (activePlugin !== null) load(activePlugin);

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
        loading = true;
        const path = `plugins/${pluginName}.json`;
        getData(path, (data: object) => {
            if (data) {
                pluginData = data;
                loading = false;
            } else {
                // TODO Show error
            }
        });
    }
</script>

<Nav/>
<div>
    <canvas id={id}></canvas>
</div>

<style>
    div {
        height: 100%;
    }
</style>