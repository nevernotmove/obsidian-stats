<script lang="ts">
    import {Chart} from 'chart.js';
    import {onDestroy, onMount} from 'svelte';
    import {randomId} from '../util';
    import pluginDownloads from './pluginDownloads';
    import {getData} from '../cache';
    import Nav from '../nav/Nav.svelte';

    console.log("init");
    
    const id = randomId();
    let pluginData: object;
    let chart: Chart;
    let loading = false;
    export let activePlugin: string = null;
    $: if (activePlugin !== null) load(activePlugin); 

    $: if (pluginData) {
        console.log("react");
        if (chart) chart.destroy();
        const targetEl = document.getElementById(id) as HTMLCanvasElement;
        if (targetEl) chart = pluginDownloads(pluginData, targetEl);
    }

    function load(pluginName: string) {
        if (loading) return;
        loading = true;
        console.log("load");
        const path = `plugins/${pluginName}.json`;
        getData(path, (data: object) => {
            if (data) {
                console.log("got data");
                pluginData = data;
                loading = false;
            } else {
                // TODO Show error
            }
        });
    }
    
    onMount(() => {
        console.log("mount");
        load(activePlugin);
    });

    onDestroy(() => {
        if (chart) chart.destroy();
    });
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