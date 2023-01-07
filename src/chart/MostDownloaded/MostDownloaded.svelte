<script lang="ts">
    import mostDownloadedPlugins from './mostDownloadedPlugins';
    import json from '../../../public/community-plugin-stats.json';
    import {onMount} from "svelte";

    onMount(() => {
        mostDownloadedPlugins(json);
    });
</script>

<canvas id="chart"></canvas>