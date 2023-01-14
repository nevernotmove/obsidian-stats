<script lang="ts">
    import {Chart} from 'chart.js';
    import {onDestroy} from 'svelte';
    import {randomId} from '../util';
    import pluginDownloads from './pluginDownloads';
    import {getData} from '../cache';

    const id = randomId();
    let pluginData: object;
    let chart: Chart;
    export let activePlugin: string = null;
    $: if (activePlugin !== null) loadPluginData(activePlugin); 

    $: if (pluginData) {
        console.log("Reacting");
        if (chart) chart.destroy();
        const targetEl = document.getElementById(id) as HTMLCanvasElement;
        if (targetEl) chart = pluginDownloads(pluginData, targetEl);
    }

    function loadPluginData(pluginName: string) {
        console.log("Loading");
        const path = `plugins/${pluginName}.json`;
        getData(path, (data: object) => {
            if (data) {
                pluginData = data;
            } else {
                // TODO Show error
            }
        });
    }

    onDestroy(() => {
        if (chart) chart.destroy();
    });
</script>

<canvas id={id}></canvas>