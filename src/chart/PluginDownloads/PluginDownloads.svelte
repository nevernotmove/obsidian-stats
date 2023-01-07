<script>
    import pluginDownloadsOverTime from "./pluginDownloadsOverTime.ts";
    import json from '../../../public/downloads.json';
    import {onMount} from "svelte";
    
    onMount(() => {
        pluginDownloadsOverTime(json);
    });
</script>

<canvas id="chart"></canvas>

<style>
    #chart {
        margin: 5%;
    }
</style>