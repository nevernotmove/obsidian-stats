<script lang="ts">
    import {Chart} from 'chart.js';
    import {onDestroy, onMount} from 'svelte';
    import {randomId} from '../util';
    import pluginDownloads from './pluginDownloads';
    import {getData} from '../cache';

    const id = randomId();
    let pluginData: object;
    let chart: Chart;
    export let activePlugin: string = null;
    $: if (activePlugin !== null) load(activePlugin); 

    $: if (pluginData) {
        if (chart) chart.destroy();
        const targetEl = document.getElementById(id) as HTMLCanvasElement;
        if (targetEl) chart = pluginDownloads(pluginData, targetEl);
    }

    function load(pluginName: string) {
        const path = `plugins/${pluginName}.json`;
        getData(path, (data: object) => {
            if (data) {
                pluginData = data;
            } else {
                // TODO Show error
            }
        });
    }
    
    onMount(() => {
        load(activePlugin);
    });

    onDestroy(() => {
        if (chart) chart.destroy();
    });
</script>

<canvas id={id}></canvas>