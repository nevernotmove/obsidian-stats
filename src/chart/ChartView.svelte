<script lang="ts">
    import {Chart, registerables} from 'chart.js';
    import MostDownloaded from './MostDownloaded/MostDownloaded.svelte';
    import PluginDownloads from './PluginDownloads/PluginDownloads.svelte';
    import type {ChartDefaults} from './ChartDefaults';
    import {Route} from 'svelte-navigator';

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
</script>

<div class="chart-container">
    <Route path="/">
        <MostDownloaded {chartDefaults}/>
    </Route>
    <Route path="/most-downloaded">
        <MostDownloaded {chartDefaults}/>
    </Route>
    <Route path="/plugin-downloads">
        <PluginDownloads {chartDefaults}/>
    </Route>
</div>

<style>
    .chart-container {
        height: 100%;
    }
</style>