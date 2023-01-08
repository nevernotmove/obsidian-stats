<script lang="ts">
    import pluginDownloadsOverTime from './pluginDownloadsOverTime';
    import json from '../../../public/downloads.json';
    import {onMount} from "svelte";
    import type {ChartDefaults} from '../ChartDefaults';
    
    export let chartDefaults: ChartDefaults;
    
    onMount(() => {
        pluginDownloadsOverTime(json, chartDefaults);
    });
</script>

<canvas id="chart"></canvas>
