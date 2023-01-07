<script lang="ts">
    import {Chart, registerables} from 'chart.js';
    import json from '../public/downloads.json';
    import json2 from '../public/community-plugin-stats.json';
    import {onMount} from 'svelte';
    import pluginDownloadsOverTime from './pluginDownloadsOverTime';
    import mostDownloadedPlugins from './mostDownloadedPlugins';

    // Bundling fails if missing
    Chart.register(...registerables);

    // Set default colors
    Chart.defaults.backgroundColor = '#1E1E1E';
    Chart.defaults.borderColor = 'rgb(139, 108, 239, 1)';
    Chart.defaults.color = '#B4B4B4';

    onMount(() => {
        pluginDownloadsOverTime(json)
        //mostDownloadedPlugins(json2);
    })
</script>

<main>
    <div class="chart-container">
        <canvas id="chart"></canvas>
    </div>
</main>

<style>
    .chart-container {
        position: relative;
        height: 100vh;
        width: 100vw;
    }

    #chart {
        margin: 5%;
    }
</style>