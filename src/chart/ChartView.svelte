<script lang="ts">
    import {Chart, registerables} from 'chart.js';
    import MostDownloaded from './MostDownloaded/MostDownloaded.svelte';
    import PluginDownloads from './PluginDownloads/PluginDownloads.svelte';
    import {ChartType} from './ChartType';
    import type {ChartDefaults} from './ChartDefaults';

    // Bundling fails if missing
    Chart.register(...registerables);
    
    // Get theme colors
    const style = getComputedStyle(document.body);
    const color1 = style.getPropertyValue('--color1');
    const color2 = style.getPropertyValue('--color2');
    const color3 = style.getPropertyValue('--color3');
    const color4 = style.getPropertyValue('--color4');
    
    const chartDefaults: ChartDefaults = {
        backgroundColor: color4,
        hoverBackgroundColor: color1,
        borderColor: color1,
        borderWidth: 2,
    }
    
    // Can't get most of these to work
    // Set default colors
    // Chart.defaults.backgroundColor = '#fff';
    // Chart.defaults.borderColor = color1;
    // Chart.defaults.color = color1;
    // Chart.defaults.font.size = 16;
    // Chart.defaults.responsive
    // Chart.defaults.hoverColor()
    // Chart.defaults.hoverBackgroundColor()
    // Chart.defaults.font

    export let activeChart: ChartType = ChartType.MostDownloaded;
</script>

<div class="chart-container">
    {#if activeChart === ChartType.MostDownloaded}
        <MostDownloaded {chartDefaults}/>
    {:else if activeChart === ChartType.PluginDownloads}
        <PluginDownloads {chartDefaults}/>
    {/if} 
</div>

<style>
    .chart-container {
        height: 100%;
    }
</style>