<script>
    import mostDownloadedPlugins from "./mostDownloadedPlugins.ts";
    import json from '../../../public/community-plugin-stats.json';
    import {onMount} from "svelte";

    onMount(() => {
        mostDownloadedPlugins(json);
    });
</script>

<canvas id="chart"></canvas>