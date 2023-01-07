<script lang="ts">
    import {Chart, registerables} from 'chart.js';
    import {onMount} from 'svelte';
    import MostDownloaded from './MostDownloaded/MostDownloaded.svelte';
    import PluginDownloads from './PluginDownloads/PluginDownloads.svelte';
    import {ChartType} from './ChartType';

    // Bundling fails if missing
    Chart.register(...registerables);

    // Set default colors
    Chart.defaults.backgroundColor = '#1E1E1E';
    Chart.defaults.borderColor = 'rgb(139, 108, 239, 1)';
    Chart.defaults.color = '#B4B4B4';

    export let activeChart = ChartType.MostDownloaded;
    
    onMount(() => {
    })
</script>

<div class="chart-container">
    {#if activeChart === ChartType.MostDownloaded}
        <MostDownloaded/>
    {:else if activeChart === ChartType.PluginDownloads}
        <PluginDownloads/>
    {/if} 
</div>

<style>
    .chart-container {
        position: relative;
        height: 100vh;
        width: 100vw;
    }
    :global(#chart) {
        margin: 5%;
    }
</style>