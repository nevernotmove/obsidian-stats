<script lang="ts">
    import {Chart, registerables} from 'chart.js';
    //import json from './assets/community-plugin-stats.json';
    //import json from './assets/downloads-time.json';
    import json from './assets/downloads.json';
    import {onMount} from 'svelte';
    import pluginDownloadsOverTime from './pluginDownloadsOverTime';

    // Bundling fails if missing
    Chart.register(...registerables);

    // Set default colors
    Chart.defaults.backgroundColor = '#1E1E1E';
    Chart.defaults.borderColor = 'rgb(139, 108, 239, 1)';
    Chart.defaults.color = '#B4B4B4';

    onMount(() => {
        pluginDownloadsOverTime(json)
        //mostDownloadedPlugins(json);
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