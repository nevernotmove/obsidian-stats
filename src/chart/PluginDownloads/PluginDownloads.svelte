<script lang="ts">
    import pluginDownloadsOverTime from './pluginDownloadsOverTime';
    import json from '../../../public/downloads.json';
    import {onMount} from "svelte";
    
    onMount(() => {
        pluginDownloadsOverTime(json);
    });
</script>

<canvas id="chart"></canvas>
