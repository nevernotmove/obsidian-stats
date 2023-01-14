<script lang="ts">
    import {Chart} from 'chart.js';
    import {onDestroy, onMount} from 'svelte';
    import {randomId} from '../util';
    import pluginDownloads from './pluginDownloads';
    import {getData} from '../cache';
    import {navigate} from 'svelte-navigator';

    export let activePlugin: string = null;
    
    $: if (activePlugin !== null) loadPluginData(activePlugin); 
    
    const id = randomId();
    let pluginData: object;
    let chart: Chart;

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
                navigate(`/plugin-stats/plugin/${pluginName}`);
            } else {
                // TODO Show error
            }
        });
    }
    
    onMount(() => {
        console.log("mount");
        console.log("Active plugin in mount", activePlugin);
        loadPluginData(activePlugin);
    });

    onDestroy(() => {
        if (chart) chart.destroy();
    });
</script>

<canvas id={id}></canvas>