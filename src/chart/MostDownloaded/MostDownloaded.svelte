<script lang="ts">
    import mostDownloadedPlugins from './mostDownloadedPlugins';
    import json from '../../../public/community-plugin-stats.json';
    import {onMount} from "svelte";
    import type {ChartDefaults} from '../ChartDefaults';
    
    export let chartDefaults: ChartDefaults;

    onMount(() => {
        mostDownloadedPlugins(json, chartDefaults);
    });
</script>

<canvas id="chart"></canvas>