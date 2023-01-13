<script lang="ts">
    import {Chart, registerables} from 'chart.js';
    import MostDownloaded from './MostDownloaded/MostDownloaded.svelte';
    import PluginDownloads from './PluginDownloads/PluginDownloads.svelte';
    import type {ChartDefaults} from './ChartDefaults';
    import {Route} from 'svelte-navigator';

    // Bundling fails if missing
    Chart.register(...registerables);

    // Get default values
    const style = getComputedStyle(document.body);
    const lineWidth = style.getPropertyValue('--chart-line-width');
    const lineColor = style.getPropertyValue('--chart-line-color');
    const lineColorHighlight = style.getPropertyValue('--chart-line-color-highlight');
    const fontColor = style.getPropertyValue('--chart-font-color');
    const fontColorHighlight = style.getPropertyValue('--chart-font-color-highlight');
    const fillColor = style.getPropertyValue('--chart-fill-color');
    const fillColorHighlight = style.getPropertyValue('--chart-fill-color-highlight');
    const gridColor = style.getPropertyValue('--chart-grid-color');

    const chartDefaults: ChartDefaults = {
        lineWidth,
        lineColor,
        lineColorHighlight,
        fontColor,
        fontColorHighlight,
        fillColor,
        fillColorHighlight,
        gridColor,
    };
</script>

<Route path="/">
    <MostDownloaded {chartDefaults}/>
</Route>
<Route path="/most-downloaded">
    <MostDownloaded {chartDefaults}/>
</Route>
<Route path="/plugin-downloads/*">
    <PluginDownloads {chartDefaults}/>
</Route>
